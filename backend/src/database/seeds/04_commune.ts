import { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

interface CommuneArrondissement {
  commune: string;
  arrondissement: string;
  departement: string;
}

interface Departement {
  id: number;
  departement: string;
  region_id: number;
}

export async function seed(knex: Knex): Promise<void> {
  // Lire le fichier JSON des communes et arrondissements
  const communeData: CommuneArrondissement[] = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/Commune.json'), 'utf-8'),
  );

  // Récupérer tous les départements de la base de données
  const departements: Departement[] = await knex('departement').select('*');

  // Créer un map des noms de département vers leurs IDs
  const departementMap: { [key: string]: number } = {};
  departements.forEach((dept) => {
    departementMap[dept.departement] = dept.id;
  });

  // Mapper les départements aux communes et arrondissements
  const communesToInsert = communeData.map((item) => {
    const departementId = departementMap[item.departement];

    if (!departementId) {
      console.warn(
        `Département non trouvé pour la commune: ${item.commune}, arrondissement: ${item.arrondissement}`,
      );
    }

    return {
      commune: item.commune,
      arrondissement: item.arrondissement,
      departement_id: departementId || null,
    };
  });

  // Supprimer toutes les entrées existantes
  await knex('commune_arrondissement').del();

  // Insérer les nouvelles données
  await knex('commune_arrondissement').insert(communesToInsert);

  console.log(
    `${communesToInsert.length} communes et arrondissements insérés.`,
  );
}
