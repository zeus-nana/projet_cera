import * as fs from 'fs';
import { Job } from 'bull';
import { Transaction } from '../../models/Transaction';
import db from '../../database/connection';

/*
 *
 * {
  "service": "service",
  "reference": "Reférence",
  "date_operation": "Date",
  "sens": "(service.startsWith('ENVOI') ? 'e' : 's')",
  "montant": "Montant",
  "frais_ht": "Frais HT",
  "tta": "Autres taxes",
  "tva": "TVA",
  "frais_ttc": "Frais TTC",
  "commission": "(service.startsWith('PAIEMENT') ? Com_Cmp_Payeur : Com_Cmp_Envoyeur)",
  "statut_operation": "Statut",
  "id_operation": "ID Trx Partenaire ",
  "expediteur": "Expéditeur",
  "beneficiaire": "Bénéficiaire",
  "guichet": "Guichet",
  "agence": "Agence",
  "compagnie": "Compagnie",
  "pays": "Src.",
  "guichet_decharge": "Guichet Payeur",
  "agence_decharge": "Agence Payeur",
  "compagnie_decharge": "Compagnie Payeur",
  "pays_decharge": "Dest.",
  "partenaire": {
    "type": "switch",
    "field": "service",
    "cases": {
      "ENVOI_C2B_BGFI_CMR": "BGFI",
      "ENVOI_C2B_ECOB_CMR": "ECOBANK",
      "ENVOI_C2B_OPI_MFS": "MFS",
      "ENVOI_C2B_OPI_THUNES": "THUNES",
      "ENVOI_C2C_OPI_MFS": "MFS",
      "ENVOI_C2C_OPI_THUNES": "THUNES",
      "ENVOI_C2W_OPI_MFS": "MFS",
      "PAIEMENT_C2C_INTL_OPI_BDE": "BDE",
      "PAIEMENT_C2C_INTL_OPI_CSCH": "CSCH",
      "PAIEMENT_C2C_INTL_OPI_CXCH": "CXCH",
      "PAIEMENT_C2C_INTL_OPI_EMI": "EMI",
      "PAIEMENT_C2C_INTL_OPI_MCO": "MCO",
      "PAIEMENT_C2C_INTL_OPI_MFS": "MFS",
      "PAIEMENT_C2C_INTL_OPI_SWGB": "SWGB",
      "PAIEMENT_C2C_INTL_OPI_TFTUS": "TFTUS",
      "PAIEMENT_C2C_INTL_OPI_WRGB": "WRGB",
      "PAIEMENT_C2C_NAT_OPI_EMC": "EMC"
    }
  },
  "categorie": {
    "type": "switch",
    "field": "service",
    "cases": {
      "ENVOI_C2B_AFB_CMR": "Partenaire Collecte&MAD",
      "ENVOI_C2B_BGFI_CMR": "Partenaire Collecte&MAD",
      "ENVOI_C2B_ECOB_CMR": "Partenaire Collecte&MAD",
      "ENVOI_C2B_OPI_MFS": "Transfert International",
      "ENVOI_C2B_OPI_THUNES": "Transfert International",
      "ENVOI_C2C_INTL": "Transfert International",
      "ENVOI_C2C_NAT": "Transfert National",
      "ENVOI_C2C_OPI_MFS": "Transfert International",
      "ENVOI_C2C_OPI_THUNES": "Transfert International",
      "ENVOI_C2W_OPI_MFS": "Transfert International",
      "PAIEMENT_C2B_EUI": "Transfert International",
      "PAIEMENT_C2C_INTL": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_BDE": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_CSCH": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_CXCH": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_EMI": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_EUI": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_MCO": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_MFS": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_SWGB": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_TFTUS": "Transfert International",
      "PAIEMENT_C2C_INTL_OPI_WRGB": "Transfert International",
      "PAIEMENT_C2C_NAT": "Transfert National",
      "PAIEMENT_C2C_NAT_OPI_EMC": "Transfert International"
    }
  },
  "sous_categorie": {
    "type": "switch",
    "field": "service",
    "cases": {
      "ENVOI_C2B_AFB_CMR": "AGENCY BANKING",
      "ENVOI_C2B_BGFI_CMR": "AGENCY BANKING",
      "ENVOI_C2B_ECOB_CMR": "AGENCY BANKING",
      "ENVOI_C2C_NAT": "ERA",
      "PAIEMENT_C2C_NAT": "ERA"
    }
  },
  "responsable": "'DCM-DTN'",
  "application": "'LCP'",
  "extra_1": "Dev. Src",
  "extra_2": "Dev. Dest",
  "extra_3": "Montant à percevoir",
  "extra_4": "Date Paiement",
  "extra_5": "Date Annulation",
  "extra_6": "Date Remboursement",
  "extra_7": "Date Dernière Modification",
  "extra_8": "Groupe",
  "extra_9": "Groupe Payeur",
  "extra_10": "Ref Partenaire",
  "extra_11": "Référence EG",
  "extra_12": "IdProofBenef",
  "extra_13": "Numéro Compte",
  "extra_14": "Intitulé Compte",
  "extra_15": "Com_Gui_Envoyeur",
  "extra_16": "Com_Age_Envoyeur",
  "extra_17": "Total",
  "extra_18": "Com_Gui_Payeur",
  "extra_19": "Com_Age_Payeur",
  "extra_20": "Autres Taxe P",
  "extra_21": "Remise",
  "extra_22": "Guichetier",
  "extra_23": "Guichetier Payeur",
  "extra_24": "TEC",
  "extra_25": "Commission Partenaire",
  "extra_26": "TEC Partenaire",
  "extra_27": "Status Partenaire"
}
 * */

import { parse } from 'csv-parse';
import { replaceEmptyWithNull } from '../../utils/replaceEmptyWithNull';
import logError from './insertErrorLogger';
import { el } from '@faker-js/faker';

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

      // Split the content into lines and filter out empty lines
      const lines = fileContent
        .split('\n')
        .filter((line) => line.trim() !== '');

      // Extract headers
      const headerLine = lines[0];
      const headers =
        headerLine
          .match(/"([^"]*)"/g)
          ?.map((h) => h.replace(/^"|"$/g, '').trim()) || [];

      // Process data lines
      const records = lines.slice(1).map((line, index) => {
        const values =
          line
            .match(/"([^"]*)"/g)
            ?.map((v) => v.replace(/^"|"$/g, '').trim()) || [];

        const record: Record<string, string> = {};
        headers.forEach((header, i) => {
          if (i === 0 && values[i]) {
            // Handle the "#" column specifically
            const [num, ...rest] = values[i].split(',');
            record['#'] = num || '';
            if (rest.length > 0) {
              record['Guichet'] = rest.join(',').trim();
            }
          } else {
            record[header] = values[i] || '';
          }
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
    service: csvRow['Service'] || '',
    reference: csvRow['Reférence'] || '',
    date_operation: parseDate(csvRow['Date']),
    sens: csvRow['Service']?.startsWith('ENVOI') ? 'e' : 's',
    montant: parseFloat(csvRow['Montant']),
    frais_ht: parseFloat(csvRow['Frais HT']),
    tta: parseFloat(csvRow['Autres taxes']),
    tva: parseFloat(csvRow['TVA']),
    frais_ttc: parseFloat(csvRow['Frais TTC']),
    commission: csvRow['Service']?.startsWith('PAIEMENT')
      ? parseFloat(csvRow['Com_Cmp_Payeur'])
      : parseFloat(csvRow['Com_Cmp_Envoyeur']),
    statut_operation: csvRow['Statut'] || '',
    id_operation: csvRow['ID Trx Partenaire'] || '',
    expediteur: csvRow['Expéditeur'] || '',
    beneficiaire: csvRow['Bénéficiaire'] || '',
    guichet: csvRow['Guichet'] || '',
    agence: csvRow['Agence'] || '',
    compagnie: csvRow['Compagnie'] || '',
    pays: csvRow['Src.'] || '',
    guichet_decharge: csvRow['Guichet Payeur'] || '',
    agence_decharge: csvRow['Agence Payeur'] || '',
    compagnie_decharge: csvRow['Compagnie Payeur'] || '',
    pays_decharge: csvRow['Dest.'] || '',
    partenaire: determinePartenaire(csvRow['Service'] || ''),
    categorie: determineCategorie(csvRow['Service'] || ''),
    sous_categorie: determineSousCategorie(csvRow['Service'] || ''),
    responsable: 'DCM-DTN',
    application: 'LCP',
    extra_1: csvRow['Dev. Src'] || '',
    extra_2: csvRow['Dev. Dest'] || '',
    extra_3: csvRow['Montant à percevoir'] || '',
    extra_4: csvRow['Date Paiement'] || '',
    extra_5: csvRow['Date Annulation'] || '',
    extra_6: csvRow['Date Remboursement'] || '',
    extra_7: csvRow['Date Dernière Modification'] || '',
    extra_8: csvRow['Groupe'] || '',
    extra_9: csvRow['Groupe Payeur'] || '',
    extra_10: csvRow['Ref Partenaire'] || '',
    extra_11: csvRow['Référence EG'] || '',
    extra_12: csvRow['IdProofBenef'] || '',
    extra_13: csvRow['Numéro Compte'] || '',
    extra_14: csvRow['Intitulé Compte'] || '',
    extra_15: csvRow['Com_Gui_Envoyeur'] || '',
    extra_16: csvRow['Com_Age_Envoyeur'] || '',
    extra_17: csvRow['Total'] || '',
    extra_18: csvRow['Com_Gui_Payeur'] || '',
    extra_19: csvRow['Com_Age_Payeur'] || '',
    extra_20: csvRow['Autres Taxe P'] || '',
    extra_21: csvRow['Remise'] || '',
    extra_22: csvRow['Guichetier'] || '',
    extra_23: csvRow['Guichetier Payeur'] || '',
    extra_24: csvRow['TEC'] || '',
    extra_25: csvRow['Commission Partenaire'] || '',
    extra_26: csvRow['TEC Partenaire'] || '',
    extra_27: csvRow['Status Partenaire'] || '',
  };
}

function determinePartenaire(service: string): string {
  const partenaireMap: { [key: string]: string } = {
    ENVOI_C2C_NAT: 'ERA',
    ENVOI_C2B_BGFI_CMR: 'BGFI',
    ENVOI_C2B_ECOB_CMR: 'ECOBANK',
    ENVOI_C2B_OPI_MFS: 'MFS',
    ENVOI_C2B_OPI_THUNES: 'THUNES',
    ENVOI_C2C_OPI_MFS: 'MFS',
    ENVOI_C2C_OPI_THUNES: 'THUNES',
    ENVOI_C2W_OPI_MFS: 'MFS',
    PAIEMENT_C2C_NAT: 'ERA',
    PAIEMENT_C2C_INTL_OPI_BDE: 'BDE',
    PAIEMENT_C2C_INTL_OPI_CSCH: 'CSCH',
    PAIEMENT_C2C_INTL_OPI_CXCH: 'CXCH',
    PAIEMENT_C2C_INTL_OPI_EMI: 'EMI',
    PAIEMENT_C2C_INTL_OPI_MCO: 'MCO',
    PAIEMENT_C2C_INTL_OPI_MFS: 'MFS',
    PAIEMENT_C2C_INTL_OPI_SWGB: 'SWGB',
    PAIEMENT_C2C_INTL_OPI_TFTUS: 'TFTUS',
    PAIEMENT_C2C_INTL_OPI_WRGB: 'WRGB',
    PAIEMENT_C2C_NAT_OPI_EMC: 'EMC',
  };
  return service in partenaireMap ? partenaireMap[service] : '';
}

function determineCategorie(service: string): string {
  const categorieMap: { [key: string]: string } = {
    ENVOI_C2B_AFB_CMR: 'Partenaire Collecte&MAD',
    ENVOI_C2B_BGFI_CMR: 'Partenaire Collecte&MAD',
    ENVOI_C2B_ECOB_CMR: 'Partenaire Collecte&MAD',
    ENVOI_C2B_OPI_MFS: 'Transfert International',
    ENVOI_C2B_OPI_THUNES: 'Transfert International',
    ENVOI_C2C_INTL: 'Transfert International',
    ENVOI_C2C_NAT: 'Transfert National',
    ENVOI_C2C_OPI_MFS: 'Transfert International',
    ENVOI_C2C_OPI_THUNES: 'Transfert International',
    ENVOI_C2W_OPI_MFS: 'Transfert International',
    PAIEMENT_C2B_EUI: 'Transfert International',
    PAIEMENT_C2C_INTL: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_BDE: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_CSCH: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_CXCH: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_EMI: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_EUI: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_MCO: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_MFS: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_SWGB: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_TFTUS: 'Transfert International',
    PAIEMENT_C2C_INTL_OPI_WRGB: 'Transfert International',
    PAIEMENT_C2C_NAT: 'Transfert National',
    PAIEMENT_C2C_NAT_OPI_EMC: 'Transfert International',
  };
  return service in categorieMap ? categorieMap[service] : '';
}

function determineSousCategorie(service: string): string {
  const sousCategorieMap: { [key: string]: string } = {
    ENVOI_C2B_AFB_CMR: 'AGENCY BANKING',
    ENVOI_C2B_BGFI_CMR: 'AGENCY BANKING',
    ENVOI_C2B_ECOB_CMR: 'AGENCY BANKING',
    ENVOI_C2B_OPI_MFS: 'EUI',
    ENVOI_C2B_OPI_THUNES: 'EUI',
    ENVOI_C2C_INTL: 'EUI',
    ENVOI_C2C_NAT: 'ERA',
    ENVOI_C2C_OPI_MFS: 'EUI',
    ENVOI_C2C_OPI_THUNES: 'EUI',
    ENVOI_C2W_OPI_MFS: 'EUI',
    PAIEMENT_C2B_EUI: 'EUI',
    PAIEMENT_C2C_INTL: 'EUI',
    PAIEMENT_C2C_INTL_OPI: 'EUI',
    PAIEMENT_C2C_INTL_OPI_BDE: 'EUI',
    PAIEMENT_C2C_INTL_OPI_CSCH: 'EUI',
    PAIEMENT_C2C_INTL_OPI_CXCH: 'EUI',
    PAIEMENT_C2C_INTL_OPI_EMI: 'EUI',
    PAIEMENT_C2C_INTL_OPI_EUI: 'EUI',
    PAIEMENT_C2C_INTL_OPI_MCO: 'EUI',
    PAIEMENT_C2C_INTL_OPI_MFS: 'EUI',
    PAIEMENT_C2C_INTL_OPI_SWGB: 'EUI',
    PAIEMENT_C2C_INTL_OPI_TFTUS: 'EUI',
    PAIEMENT_C2C_INTL_OPI_WRGB: 'EUI',
    PAIEMENT_C2C_NAT: 'ERA',
    PAIEMENT_C2C_NAT_OPI_EMC: 'EUI',
  };
  return service in sousCategorieMap ? sousCategorieMap[service] : '-';
}

async function processEuing(job: Job<JobData>): Promise<void> {
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
          transaction.pole = agenceInfo.pole ?? null;
        }

        transaction.chargement_id = chargement_id;
        transaction.etat = fileName;

        // Remplace les valeurs vides par NULL
        const transactionToInsert = replaceEmptyWithNull({ ...transaction });

        try {
          // Insertion dans la base de données
          await db('transaction').insert(transactionToInsert);

          successCount++;
        } catch (error: any) {
          if (error.code === '23505') {
            // PostgreSQL unique violation error code
            // If it's a uniqueness error, update the existing transaction
            await db('transaction')
              .where({
                reference: transactionToInsert.reference,
                service: transaction.service,
              })
              .update({
                statut_operation: transactionToInsert.statut_operation,
              });
            successCount++;
          } else {
            throw error;
          }
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

    // Update the chargement table with success and failure counts
    await db('chargement').where({ id: chargement_id }).update({
      statut: 't',
      nombre_succes: successCount,
      nombre_echec: failureCount,
    });
  } catch (error) {
    console.error('Error processing EUING file:', error);
    throw error;
  }
}

function extractCodeAgence(guichet: string): string {
  const parts = guichet.split('-');
  return parts.length > 2 ? parts[2] : '';
}

export default processEuing;
