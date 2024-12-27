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

interface RiaRecord {
  'Numero de transfert': string;
  PIN: string;
  'Mode de livraison': string;
  Caissier: string;
  Agence: string;
  'Code Agence': string;
  'Agence Réconciliation': string;
  'Code A. réconciliation': string;
  'Montant Envoye': string;
  "Devise d'Envoi": string;
  "Pays d'Envoi": string;
  'Pays de destination': string;
  'Montant à Payer': string;
  'Devise de paiement': string;
  'Montant de la commission SA': string;
  'Devise de la commission SA': string;
  Date: string;
  Taux: string;
  CTE: string;
  TVA1: string;
  TVA2: string;
  Frais: string;
  Action: string;
  TTA: string;
  'Montant final payé': string;
}

async function processCSV(filePath: string): Promise<RiaRecord[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'latin1' }, (err, fileContent) => {
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
        (error, records: RiaRecord[]) => {
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

function mapRiaToTransaction(riaRecord: RiaRecord): Partial<Transaction> {
  const parseDate = (dateString: string): Date | undefined => {
    const [date, time] = dateString.split(' ');
    const [day, month, year] = date.split('/');
    const dateObj = new Date(`${year}-${month}-${day}T${time}`);
    return isNaN(dateObj.getTime()) ? undefined : dateObj;
  };

  const parseFloat = (value: string): number | null => {
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  const determineSens = (action: string): 'e' | 's' => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('envoi') || actionLower.includes('annulation'))
      return 'e';
    if (actionLower.includes('transfert payé')) return 's';
    throw new Error(`Action non reconnue pour sens: ${action}`);
  };

  const determineService = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('envoi')) return 'ENVOI';
    if (actionLower.includes('transfert payé')) return 'PAIEMENT';
    if (actionLower.includes('annulation')) return 'ANNULATION';
    throw new Error(`Action non reconnue pour service: ${action}`);
  };

  const determineMontant = (
    action: string,
    montantEnvoye: string,
    montantAPayer: string,
  ): number | null => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('envoi'))
      return parseFloat(montantEnvoye)
        ? Math.abs(parseFloat(montantEnvoye)!)
        : null;
    if (actionLower.includes('annulation'))
      return parseFloat(montantEnvoye)
        ? Math.abs(parseFloat(montantEnvoye)!)
        : null;
    if (actionLower.includes('transfert payé'))
      return parseFloat(montantAPayer)
        ? Math.abs(parseFloat(montantAPayer)!)
        : null;
    return null;
  };

  const sens = determineSens(riaRecord.Action);
  const service = determineService(riaRecord.Action);

  return {
    reference: riaRecord['Numero de transfert'],
    id_operation: riaRecord.PIN,
    montant: determineMontant(
      riaRecord.Action,
      riaRecord['Montant Envoye'],
      riaRecord['Montant à Payer'],
    ),
    frais_ht: parseFloat(riaRecord.Frais),
    commission: parseFloat(riaRecord.CTE),
    sens: sens,
    service: service,
    date_operation: parseDate(riaRecord.Date),
    pays: riaRecord["Pays d'Envoi"],
    pays_decharge: riaRecord['Pays de destination'],
    partenaire: 'RIA',
    application: 'web ria',
    responsable: 'DCM_DMP',
    categorie: 'Transfert International',
    sous_categorie: 'Transfert',
    etat: 'ria',
    statut_operation: riaRecord.Action,
  };
}

async function processRia(job: Job<JobData>): Promise<void> {
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
        const transaction: Partial<Transaction> = mapRiaToTransaction(record);

        const agenceInfo = agenceLocaliteData.find(
          (a) => a.id_ria === record['Code A. réconciliation'],
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
    console.error('Error processing RIA file:', error);
    throw error;
  }
}

export default processRia;
