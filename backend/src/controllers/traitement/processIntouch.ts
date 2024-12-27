import * as fs from 'fs';
import { Job } from 'bull';
import { Transaction } from '../../models/Transaction';
import db from '../../database/connection';
import { parse } from 'csv-parse';
import { replaceEmptyWithNull } from '../../utils/replaceEmptyWithNull';
import logError from './insertErrorLogger';

interface JobData {
  filePath: string;
  chargement_id: number;
  fileName: string;
}

interface IntouchRecord {
  ID: string;
  IDTransaction: string;
  'Telephone client': string;
  Montant: string;
  Service: string;
  'Moyen de Paiement': string;
  Agence: string;
  Agent: string;
  'Type agent': string;
  PIXI: string;
  Date: string;
  'Num Trans GU': string;
  'G RX': string;
  Statut: string;
  Latitude: string;
  Longitude: string;
  'ID Partenaire DIST': string;
}

async function processCSV(filePath: string): Promise<IntouchRecord[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }

      parse(
        fileContent,
        {
          columns: true,
          delimiter: ';',
          skip_empty_lines: true,
        },
        (error, records: IntouchRecord[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(records);
          }
        },
      );
    });
  });
}

function mapIntouchToTransaction(
  intouchRecord: IntouchRecord,
): Partial<Transaction> {
  const parseDate = (dateString: string): Date | undefined => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const parseFloat = (value: string): number | null => {
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  const determineService = (service: string): string => {
    if (service.toLowerCase().includes('cashinom')) return 'DEPOT OM';
    if (service.toLowerCase().includes('cashinmtn')) return 'DEPOT MTN';
    if (service.toLowerCase().includes('CM_AIRTIME_ORANGE'))
      return 'AIRTIME ORANGE';
    if (service.toLowerCase().includes('CM_AIRTIME_MTN')) return 'AIRTIME MTN';
    if (service.toLowerCase().includes('CM_AIRTIME_CAMTEL'))
      return 'DEPOT CAMTEL';
    return service;
  };

  const determineSens = (service: string): 'e' | 's' | undefined => {
    if (service.toLowerCase().includes('cashout')) return 's';
    if (
      service.toLowerCase().includes('cashin') ||
      service.toLowerCase().includes('airtime')
    )
      return 'e';
  };

  const determineSousCategorie = (service: string): string => {
    switch (service) {
      case 'CASHOUTOMCM2':
      case 'CASHINOMCM2':
      case 'AIRTIMEORANGECM':
        return 'Orange Money';
      case 'CASHOUTMTNCM2':
      case 'CASHINMTNCM2':
      case 'CM_AIRTIME_MTN':
        return 'AIRTIME MTN Mobile Money';
      case 'CM_AIRTIME_CAMTEL':
        return 'AIRTIME CAMTEL';
      case 'CM_AIRTIME_ORANGE':
        return 'AIRTIME ORANGE';
      default:
        return '';
    }
  };

  return {
    montant: parseFloat(intouchRecord.Montant),
    service: determineService(intouchRecord.Service),
    reference: intouchRecord['Num Trans GU'],
    beneficiaire: intouchRecord['Telephone client'],
    guichet: intouchRecord.Agence,
    sous_categorie: determineSousCategorie(intouchRecord.Service),
    partenaire: 'INTOUCH',
    application: 'GUICHET UNIQUE',
    responsable: 'DCM_DMP',
    categorie: 'Mobile Money',
    etat: 'intouch',
    sens: determineSens(intouchRecord.Service),
    date_operation: parseDate(intouchRecord.Date),
  };
}

async function processIntouch(job: Job<JobData>): Promise<void> {
  const { fileName, filePath, chargement_id } = job.data;

  try {
    const agenceLocaliteData = await db.select('*').from('vw_agence_localite');
    const records = await processCSV(filePath);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const lineNumber = i + 2;

      try {
        const transaction: Partial<Transaction> =
          mapIntouchToTransaction(record);

        const agenceInfo = agenceLocaliteData.find(
          (a) => a.id_intouch === record.Agence,
        );

        if (agenceInfo) {
          transaction.v_hv = agenceInfo.v_hv ?? null;
          transaction.region = agenceInfo.region ?? null;
          transaction.departement = agenceInfo.departement ?? null;
          transaction.commune = agenceInfo.commune ?? null;
          transaction.code_agence = agenceInfo.code_agence ?? null;
          transaction.pole = agenceInfo.pole ?? null;
          transaction.agence = agenceInfo.agence ?? null;
        }

        transaction.chargement_id = chargement_id;

        const transactionToInsert = replaceEmptyWithNull({ ...transaction });

        try {
          await db('transaction').insert(transactionToInsert);
          successCount++;
        } catch (error: any) {
          // Instead of updating, we'll just throw the error
          throw error;
        }
      } catch (error: unknown) {
        failureCount++;
        await logError({
          chargementId: chargement_id,
          ligneConflictuelle: JSON.stringify(record),
          numeroLigne: lineNumber,
          error: error,
        });
      }
    }

    console.log(
      `Processing complete. ${successCount} records processed successfully, ${failureCount} failures out of ${records.length} total records.`,
    );

    await db('chargement').where({ id: chargement_id }).update({
      statut: 't',
      nombre_succes: successCount,
      nombre_echec: failureCount,
    });
  } catch (error) {
    console.error('Error processing Intouch file:', error);
    throw error;
  }
}

export default processIntouch;
