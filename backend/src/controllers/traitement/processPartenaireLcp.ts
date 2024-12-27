import * as fs from 'fs';
import { Job } from 'bull';
import { Transaction } from '../../models/Transaction';
import db from '../../database/connection';
import { replaceEmptyWithNull } from '../../utils/replaceEmptyWithNull';
import logError from './insertErrorLogger';

interface JobData {
  filePath: string;
  chargement_id: number;
  fileName: string;
}

export async function processCSV(
  filePath: string,
): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        reject(err);
        return;
      }

      const lines = fileContent
        .split('\n')
        .filter((line) => line.trim() !== '');

      const headerLine = lines[0];
      const headers =
        headerLine
          .match(/"([^"]*)"/g)
          ?.map((h) => h.replace(/^"|"$/g, '').trim()) || [];

      const records = lines.slice(1).map((line) => {
        const values =
          line
            .match(/"([^"]*)"/g)
            ?.map((v) => v.replace(/^"|"$/g, '').trim()) || [];

        const record: Record<string, string> = {};
        headers.forEach((header, i) => {
          record[header] = values[i] || '';
        });

        return record;
      });

      resolve(records);
    });
  });
}

function mapCsvToTransaction(
  csvRow: Record<string, string>,
): Partial<Transaction> {
  const parseDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart || !timePart) return undefined;
    const [day, month, year] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
    if (!day || !month || !year || !hour || !minute || !second)
      return undefined;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );
  };

  const parseFloat = (value: string | undefined): number | null => {
    if (!value) return null;
    const parsed = Number(value.replace(',', '.'));
    return isNaN(parsed) ? null : parsed;
  };

  return {
    montant: parseFloat(csvRow['Montant']),
    frais_ht: parseFloat(csvRow['Frais HT']),
    tva: parseFloat(csvRow['Taxes']),
    frais_ttc: parseFloat(csvRow['Frais TTC']),
    commission: parseFloat(csvRow['Com_Cmp_Envoyeur']),
    service: csvRow['Service'] || '',
    sens: 'e',
    date_operation: parseDate(csvRow['Date']),
    statut_operation: csvRow['Statut'] || '',
    reference: csvRow['Reférence'] || '',
    id_operation: csvRow['Reference Partenaire'] || '',
    guichet: csvRow['Guichet'] || '',
    agence: csvRow['Agence'] || '',
    compagnie: csvRow['Compagnie'] || '',

    etat: 'partenaire_lcp',
    categorie: 'Partenaire Collecte&MAD',
    sous_categorie: determineSousCategorie(csvRow['Service'] || ''),
    responsable: 'DCM-DTI',
    partenaire: 'EUF',
    application: 'LCP',
    extra_1: csvRow['Dev. Src'] || '',
    extra_2: csvRow['Dev. Dest'] || '',
    extra_4: csvRow['Facture Number'] || '',
    extra_5: csvRow['Numero Abonne'] || '',
    extra_6: csvRow['Nom Abonne'] || '',
    extra_7: csvRow['Libelle Facture'] || '',
    extra_8: csvRow['Nom du payeur'] || '',
    extra_9: csvRow['Telephone du payeur'] || '',
    extra_10: csvRow['Numéro Compte'] || '',
    extra_11: csvRow['Intitulé Compte'] || '',
    extra_12: csvRow['Partner Retun Code'] || '',
    extra_13: csvRow['Partner Retun Message'] || '',
    extra_14: csvRow['Com_Gui_Envoyeur'] || '',
    extra_15: csvRow['Com_Age_Envoyeur'] || '',
    extra_16: csvRow['Groupe'] || '',
  };
}

function determineSousCategorie(service: string): string {
  const sousCategorieMap: { [key: string]: string } = {
    'PAIEMENT ENSP YAOUNDE': 'UNIVERSITES/ECOLES',
    'Paiement des droits universitaires Dschang': 'UNIVERSITES/ECOLES',
    'Frais de Scolarité SEDUC Yaoundé': 'UNIVERSITES/ECOLES',
    'Frais de Scolarité SEDUC Ebolowa': 'UNIVERSITES/ECOLES',
    'Collecte VEO': 'ENTREPRISES',
    'Paiement des factures GUCE': 'ENTREPRISES',
    'Paiement Douane': 'ENTREPRISES',
    'Dépôt Bancaire ECOBANK CMR': 'ENTREPRISES',
    'Paiement facture ENEO': 'FACTURES GUICHET',
    'Paiement Camwater PostPay': 'FACTURES GUICHET',
  };
  return service in sousCategorieMap ? sousCategorieMap[service] : '';
}

async function processPartenaireLcp(job: Job<JobData>): Promise<void> {
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
        const transaction: Partial<Transaction> = mapCsvToTransaction(record);

        const codeAgence = extractCodeAgence(transaction.guichet || '');
        const agenceInfo = agenceLocaliteData.find(
          (a) => a.code_agence === codeAgence,
        );

        if (agenceInfo) {
          transaction.v_hv = agenceInfo.v_hv ?? null;
          transaction.region = agenceInfo.region ?? null;
          transaction.departement = agenceInfo.departement ?? null;
          transaction.commune = agenceInfo.commune ?? null;
          transaction.code_agence = agenceInfo.code_agence ?? null;
          transaction.agence = agenceInfo.agence ?? null;
          transaction.pole = agenceInfo.pole ?? null;
        }

        transaction.chargement_id = chargement_id;

        const transactionToInsert = replaceEmptyWithNull({ ...transaction });

        await db('transaction').insert(transactionToInsert);
        successCount++;
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
    console.error('Error processing Partenaire LCP file:', error);
    throw error;
  }
}

function extractCodeAgence(guichet: string): string {
  const parts = guichet.split('-');
  return parts.length > 2 ? parts[2] : '';
}

export default processPartenaireLcp;
