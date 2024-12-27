import { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

interface Agence {
  code_agence: string;
  agence: string;
  gesuni: string;
  reseau: string;
  pole: string;
  type_agence: string;
  v_hv: string;
  telephone: string;
  id_lmt_om: string | null;
  id_avs_momo: string | null;
  id_gs_momo: string | null;
  id_gs_om: string | null;
  id_avs_wafacash: string | null;
  id_bacm: string | null;
  id_intouch: string | null;
  id_sce_wafacash: string | null;
  id_western_ecobank: string | null;
  id_afrik_com_wafacash: string | null;
  id_western_emi: string | null;
  commune: string;
  id_hop_international: string | null;
  id_emi_ecobank: string | null;
  id_uba: string | null;
  id_ria: string | null;
  id_axa: string | null;
}

interface CommuneArrondissement {
  id: number;
  commune: string;
  arrondissement: string;
  departement_id: number;
}

export async function seed(knex: Knex): Promise<void> {
  // Lire le fichier JSON des agences
  const agenceData: Agence[] = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/agence.json'), 'utf-8'),
  );

  // Récupérer toutes les communes de la base de données
  const communes: CommuneArrondissement[] = await knex(
    'commune_arrondissement',
  ).select('*');

  // Créer un map des noms de commune vers leurs IDs
  const communeMap: { [key: string]: number } = {};
  communes.forEach((commune) => {
    communeMap[commune.commune] = commune.id;
  });

  // Mapper les communes aux agences
  const agencesToInsert = agenceData.map((item) => {
    const communeId = communeMap[item.commune];

    if (!communeId) {
      console.warn(
        `Commune non trouvée pour l'agence: ${item.agence}, commune: ${item.commune}`,
      );
    }

    return {
      code_agence: item.code_agence,
      agence: item.agence,
      gesuni: item.gesuni,
      reseau: item.reseau,
      pole: item.pole,
      type_agence: item.type_agence,
      v_hv: item.v_hv,
      telephone: item.telephone,
      id_lmt_om: item.id_lmt_om,
      id_avs_momo: item.id_avs_momo,
      id_gs_momo: item.id_gs_momo,
      id_gs_om: item.id_gs_om,
      id_avs_wafacash: item.id_avs_wafacash,
      id_bacm: item.id_bacm,
      id_intouch: item.id_intouch,
      id_sce_wafacash: item.id_sce_wafacash,
      id_western_ecobank: item.id_western_ecobank,
      id_afrik_com_wafacash: item.id_afrik_com_wafacash,
      id_western_emi: item.id_western_emi,
      commune_id: communeId || null,
      id_hop_international: item.id_hop_international,
      id_emi_ecobank: item.id_emi_ecobank,
      id_uba: item.id_uba,
      id_ria: item.id_ria,
      id_axa: item.id_axa,
    };
  });

  // Supprimer toutes les entrées existantes
  await knex('agence').del();

  // Insérer les nouvelles données
  await knex('agence').insert(agencesToInsert);

  console.log(`${agencesToInsert.length} agences insérées.`);
}
