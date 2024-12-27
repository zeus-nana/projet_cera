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

function parseDate(dateString: string, timeString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
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

async function processGraphicSystemOM(job: Job<JobData>): Promise<void> {
  const { filePath, chargement_id } = job.data;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const totalRows = range.e.r;

    const allAgenceInfo = await db('vw_agence_localite').select('*');
    const agenceInfoMap = new Map(
      allAgenceInfo.map((info) => [info.id_gs_om, info]),
    );

    let successCount = 0;
    let failureCount = 0;

    for (let rowIndex = 0; rowIndex <= totalRows; rowIndex++) {
      const row: any = {};
      for (let colIndex = 0; colIndex <= range.e.c; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: colIndex,
        });
        row[`__EMPTY_${colIndex}`] = getCell(worksheet, cellAddress);
      }

      const lineNumber = rowIndex + 1; // Excel rows are 1-indexed

      try {
        if (row['__EMPTY_6'] === 'Succès') {
          const dateOperation = parseDate(row['__EMPTY_1'], row['__EMPTY_2']);

          const isCashIn = row['__EMPTY_4'] === 'Cash in';
          const isC2CTransfer = row['__EMPTY_4'] === 'C2C Transfer';

          let montant;
          if (isC2CTransfer) {
            montant =
              parseNumber(row['__EMPTY_14']) ||
              parseNumber(row['__EMPTY_13']) ||
              parseNumber(row['__EMPTY_12']);
          } else {
            montant = isCashIn
              ? parseNumber(row['__EMPTY_13'])
              : parseNumber(row['__EMPTY_14']);
          }

          const transaction: Partial<Transaction> = {
            reference: row['__EMPTY_3'],
            service: row['__EMPTY_4'],
            guichet: row['__EMPTY_8'],
            beneficiaire: row['__EMPTY_11'],
            montant: montant,
            frais_ttc: parseNumber(row['__EMPTY_16']),
            categorie: 'Mobile Money',
            sous_categorie: 'Orange Money',
            responsable: 'DCM-DMP',
            partenaire: 'GRAPHIC SYSTEM',
            application: 'PUCES PARTENAIRES',
            sens: isCashIn ? 'e' : 's',
            etat: 'graphic_system_om',
            chargement_id: chargement_id,
            date_operation: dateOperation,
          };

          const agenceInfo = agenceInfoMap.get(row['__EMPTY_8']);

          if (agenceInfo) {
            transaction.v_hv = agenceInfo.v_hv;
            transaction.agence = agenceInfo.agence;
            transaction.region = agenceInfo.region;
            transaction.departement = agenceInfo.departement;
            transaction.commune = agenceInfo.commune;
            transaction.code_agence = agenceInfo.code_agence;
            transaction.pole = agenceInfo.pole;

            // Calculate commission
            const fraisTTC = parseNumber(row['__EMPTY_16']) || 0;
            if (
              agenceInfo.code_agence === '4IH' &&
              row['__EMPTY_8'] === '656158425'
            ) {
              transaction.commission = fraisTTC * 0.5;
            } else if (
              agenceInfo.code_agence !== '4IH' &&
              row['__EMPTY_8'] !== '656158425'
            ) {
              transaction.commission = fraisTTC * 0.9;
            } else if (
              agenceInfo.code_agence !== '4IH' &&
              row['__EMPTY_8'] === '656158425'
            ) {
              transaction.commission = fraisTTC * 0.5 * 0.2;
            } else {
              transaction.commission = 0;
            }
          }

          // Replace empty values with NULL
          const transactionToInsert = replaceEmptyWithNull({ ...transaction });

          // Insert into database
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

    console.log(
      `Processing complete. ${successCount} records processed successfully, ${failureCount} failures out of ${totalRows + 1} total rows.`,
    );

    // Update the chargement table with success and failure counts
    await db('chargement').where({ id: chargement_id }).update({
      statut: 't',
      nombre_succes: successCount,
      nombre_echec: failureCount,
    });
  } catch (error) {
    console.error('Error processing Graphic System OM file:', error);
    throw error;
  }
}

export default processGraphicSystemOM;
