import * as XLSX from 'xlsx';
import path from 'path';
import { Transaction } from '../../models/Transaction';
import db from '../../database/connection';
import { Job } from 'bull';
import { replaceEmptyWithNull } from '../../utils/replaceEmptyWithNull';
import logError from './insertErrorLogger';

interface JobData {
  filePath: string;
  chargement_id: number;
}

interface AgenceInfo {
  v_hv: string;
  region: string;
  departement: string;
  commune: string;
  code_agence: string;
  pole: string;
}

function parseExcelDate(serialDate: number): Date {
  // Excel's date system starts on January 1, 1900
  const date = new Date(Date.UTC(1899, 11, 30));
  date.setUTCDate(date.getUTCDate() + Math.floor(serialDate));

  // Handle the fractional part (time)
  const fractionalDay = serialDate % 1;
  const totalMilliseconds = Math.round(fractionalDay * 24 * 60 * 60 * 1000);
  date.setUTCMilliseconds(date.getUTCMilliseconds() + totalMilliseconds);

  return date;
}

function parseDate(dateValue: any): Date | undefined {
  if (typeof dateValue === 'number') {
    return parseExcelDate(dateValue);
  } else if (typeof dateValue === 'string') {
    // Keep the existing string parsing logic
    const parts = dateValue.split('  ');
    if (parts.length === 2) {
      const [date, time] = parts;
      const [day, month, year] = date.split('/').map(Number);
      const [hours, minutes, seconds] = time.split(':').map(Number);

      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        !isNaN(hours) &&
        !isNaN(minutes) &&
        !isNaN(seconds)
      ) {
        return new Date(year, month - 1, day, hours, minutes, seconds);
      }
    }
  }

  console.warn(`Invalid date value: ${dateValue}`);
}

function parseNumber(value: any): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(',', '.'));
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

function getCell(worksheet: XLSX.WorkSheet, cellAddress: string): any {
  const cell = worksheet[cellAddress];
  return cell ? cell.v : undefined;
}

async function processDiool(job: Job<JobData>): Promise<void> {
  const { filePath, chargement_id } = job.data;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const totalRows = range.e.r;

    const allAgenceInfo = await db('vw_agence_localite').select('*');
    const agenceInfoMap = new Map(
      allAgenceInfo.map((info) => [info.code_agence, info]),
    );

    let successCount = 0;
    let failureCount = 0;
    const commissionRows: any[] = [];

    // First pass: process all non-commission rows
    for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {
      const row: any = {};
      for (let colIndex = 0; colIndex <= range.e.c; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: colIndex,
        });
        row[`col_${colIndex}`] = getCell(worksheet, cellAddress);
      }

      const lineNumber = rowIndex + 1;
      const tdt = (row['col_12'] || '').toLowerCase();

      if (tdt.includes('commission')) {
        commissionRows.push(row);
        continue;
      }

      try {
        if (
          tdt.includes('depot') ||
          tdt.includes('retrait') ||
          tdt === '' ||
          tdt.includes('transfert')
        ) {
          const montant = parseNumber(row['col_3']) || 0;
          const dateOperation = parseDate(row['col_4']);

          if (!dateOperation) {
            console.warn(`Invalid date at row ${lineNumber}: ${row['col_4']}`);
          }

          // @ts-ignore
          const transaction: Partial<Transaction> = {
            reference: row['col_7'],
            service: getService(tdt),
            montant: Math.abs(montant),
            frais_ttc: parseNumber(row['col_6']) || 0,
            commission: 0, // Will be updated later
            categorie: tdt === '' ? 'Partenaire Collecte&MAD' : 'MOBILE MONEY',
            sous_categorie: tdt === '' ? 'AIRTIME' : 'MOBILE MONEY',
            responsable: 'DCM-DMP',
            partenaire: 'DIOOL',
            application: 'https://login.diool.com/login?lang=fr',
            sens: getSens(tdt, montant),
            etat: 'diool',
            chargement_id: chargement_id,
            date_operation: dateOperation,
            expediteur: row['col_9'],
          };

          const boutique = row['col_11'];
          const codeAgence = boutique.substring(4, 7);
          const agenceInfo = agenceInfoMap.get(codeAgence);

          if (agenceInfo) {
            Object.assign(transaction, {
              v_hv: agenceInfo.v_hv,
              agence: agenceInfo.agence,
              region: agenceInfo.region,
              departement: agenceInfo.departement,
              commune: agenceInfo.commune,
              code_agence: agenceInfo.code_agence,
              pole: agenceInfo.pole,
            });
          }

          const transactionToInsert = replaceEmptyWithNull({ ...transaction });

          await db('transaction').insert(transactionToInsert);

          successCount++;
        }
      } catch (error: unknown) {
        failureCount++;
        await logError({
          chargementId: chargement_id,
          ligneConflictuelle: JSON.stringify(row),
          numeroLigne: lineNumber,
          error: error,
        });
      }
    }

    for (const row of commissionRows) {
      const lineNumber = row['__rowNum__'] + 1;
      try {
        const refId = row['col_7'];
        const commission = Math.abs(parseNumber(row['col_3']) || 0);

        // Vérifier si la transaction existe
        const existingTransaction = await db('transaction')
          .where({ etat: 'diool', reference: refId })
          .first();

        if (!existingTransaction) {
          // La transaction n'a pas été trouvée
          await logError({
            chargementId: chargement_id,
            ligneConflictuelle: JSON.stringify(row),
            numeroLigne: lineNumber,
            error: new Error('Transaction non trouvée pour cette commission'),
          });
          failureCount++;
        } else {
          // Normaliser les valeurs de commission pour la comparaison
          const existingCommissionComparable = Number(
            existingTransaction.commission,
          ).toFixed(5);
          const newCommissionComparable = Number(commission).toFixed(5);

          if (existingCommissionComparable === newCommissionComparable) {
            // La commission est déjà attribuée et identique, logger l'information
            console.log(
              `Commission déjà insérée et identique pour la transaction ${refId}`,
            );
            await logError({
              chargementId: chargement_id,
              ligneConflictuelle: JSON.stringify(row),
              numeroLigne: lineNumber,
              error: new Error('Commission déjà insérée et identique'),
            });
            failureCount++;
          } else {
            // La transaction existe et la commission est différente, procéder à la mise à jour
            const updateResult = await db('transaction')
              .where({ id: existingTransaction.id })
              .update({ commission: commission });

            if (updateResult > 0) {
              successCount++;
              console.log(
                `Commission mise à jour pour la transaction ${refId}`,
              );
            } else {
              // Ce cas ne devrait théoriquement pas se produire, mais on le gère par précaution
              await logError({
                chargementId: chargement_id,
                ligneConflictuelle: JSON.stringify(row),
                numeroLigne: lineNumber,
                error: new Error('Échec du traitement de la commission'),
              });
              failureCount++;
            }
          }
        }
      } catch (error: unknown) {
        failureCount++;
        await logError({
          chargementId: chargement_id,
          ligneConflictuelle: JSON.stringify(row),
          numeroLigne: lineNumber,
          error: error,
        });
      }
    }

    console.log(
      `Processing complete. ${successCount} records processed successfully, ${failureCount} failures.`,
    );

    await db('chargement').where({ id: chargement_id }).update({
      statut: 't',
      nombre_succes: successCount,
      nombre_echec: failureCount,
    });
  } catch (error) {
    console.error('Error processing Diool file:', error);
    throw error;
  }
}

function getService(tdt: string): string {
  if (tdt.includes('depot')) return 'DEPOT';
  if (tdt.includes('retrait')) return 'RETRAIT';
  if (tdt === '') return 'AIRTIME';
  if (tdt.includes('transfert')) return 'TRANSFERT INTERNE';
  return '';
}

function getSens(tdt: string, montant: number): 'e' | 's' | undefined {
  if (tdt.includes('retrait')) return 's';
  if (tdt.includes('depot')) return 'e';
  if (tdt.includes('transfert')) return montant < 0 ? 's' : 'e';
}

function findCommissionRow(
  worksheet: XLSX.WorkSheet,
  refId: string,
  totalRows: number,
): any | null {
  for (let i = 1; i <= totalRows; i++) {
    const row: any = {};
    for (let j = 0; j <= 12; j++) {
      const cellAddress = XLSX.utils.encode_cell({ r: i, c: j });
      row[`col_${j}`] = getCell(worksheet, cellAddress);
    }
    if (
      row['col_7'] === refId &&
      row['col_12']?.toLowerCase().includes('commissions')
    ) {
      return row;
    }
  }
  return null;
}

export default processDiool;
