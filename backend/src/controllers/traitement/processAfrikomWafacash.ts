import * as XLSX from 'xlsx';
import { Transaction } from '../../models/Transaction';
import db from '../../database/connection';
import { Job } from 'bull';
import { replaceEmptyWithNull } from '../../utils/replaceEmptyWithNull';
import logError from './insertErrorLogger';

interface JobData {
  filePath: string;
  chargement_id: number;
}

function parseExcelDate(excelDate: number): Date {
  // Excel's date system starts from January 1, 1900
  const baseDate = new Date(1900, 0, 1);
  // Subtract 2 to account for Excel's leap year bug
  const daysToAdd = excelDate - 2;
  baseDate.setDate(baseDate.getDate() + daysToAdd);
  return baseDate;
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

function calculateCommission(
  service: string,
  frais: number,
  montant: number,
): number {
  if (service.includes('Emission')) {
    return frais * 0.12;
  } else if (service.includes('eneo')) {
    return frais * 0.12;
  } else if (service.includes('Distribution')) {
    return montant * 0.04;
  }
  return 0;
}

function determineSens(service: string): 'e' | 's' | undefined {
  if (service.includes('Emission')) {
    return 'e';
  } else if (
    service.includes('Distribution') ||
    service.includes('Annulation')
  ) {
    return 's';
  }
  return undefined;
}

async function processAfrikomWafacash(job: Job<JobData>): Promise<void> {
  const { filePath, chargement_id } = job.data;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const allAgenceInfo = await db('vw_agence_localite').select('*');
    const agenceInfoMap = new Map(
      allAgenceInfo.map((info) => [info.id_afrik_com_wafacash, info]),
    );

    let successCount = 0;
    let failureCount = 0;

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row: any = data[rowIndex];
      const lineNumber = rowIndex + 2; // Accounting for header row and 1-indexing

      try {
        const montant = parseNumber(row['Montant']) || 0;
        const frais = parseNumber(row['Frais']) || 0;
        const taxe = parseNumber(row['Taxe']) || 0;

        const transaction: Partial<Transaction> = {
          reference: row['Référence'],
          service: row['Service'],
          montant: Math.abs(montant - frais - taxe),
          frais_ttc: frais + taxe,
          frais_ht: frais,
          commission: calculateCommission(row['Service'], frais, montant),
          categorie: 'Transfert International',
          sous_categorie: 'OPI',
          responsable: 'DCM-DTI',
          partenaire: 'AFRIK COM',
          application: 'INTEGRA',
          sens: determineSens(row['Service']),
          etat: 'afrikom_wafacash',
          chargement_id: chargement_id,
          date_operation: parseExcelDate(row['Date']),
        };

        const agenceInfo = agenceInfoMap.get(row['Code']);

        if (agenceInfo) {
          transaction.v_hv = agenceInfo.v_hv;
          transaction.agence = agenceInfo.agence;
          transaction.region = agenceInfo.region;
          transaction.departement = agenceInfo.departement;
          transaction.commune = agenceInfo.commune;
          transaction.code_agence = agenceInfo.code_agence;
          transaction.pole = agenceInfo.pole;
        }

        // Replace empty values with NULL
        const transactionToInsert = replaceEmptyWithNull({ ...transaction });

        // Insert into database
        await db('transaction').insert(transactionToInsert);

        successCount++;
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
      `Processing complete. ${successCount} records processed successfully, ${failureCount} failures out of ${data.length} total rows.`,
    );

    // Update the chargement table with success and failure counts
    await db('chargement').where({ id: chargement_id }).update({
      statut: 't',
      nombre_succes: successCount,
      nombre_echec: failureCount,
    });
  } catch (error) {
    console.error('Error processing Afrikom Wafacash file:', error);
    throw error;
  }
}

export default processAfrikomWafacash;
