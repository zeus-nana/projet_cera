import { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

interface Departement {
  departement: string;
  region_id: number;
}

interface Region {
  id: number;
  region: string;
  chef_lieu: string;
}

export async function seed(knex: Knex): Promise<void> {
  // Lire le fichier JSON
  const jsonPath = path.join(__dirname, '..', 'data', 'departement.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const departements: Departement[] = JSON.parse(rawData);

  // Récupérer toutes les régions de la base de données
  const regions: Region[] = await knex('region').select('*');

  // Créer un mapping des noms de régions à leurs IDs
  const regionMapping: { [key: string]: number } = {};
  regions.forEach((region) => {
    switch (region.region) {
      case 'Adamaoua':
        regionMapping['1'] = region.id;
        break;
      case 'Centre':
        regionMapping['2'] = region.id;
        break;
      case 'Est':
        regionMapping['3'] = region.id;
        break;
      case 'Extreme-Nord':
        regionMapping['4'] = region.id;
        break;
      case 'Littoral':
        regionMapping['5'] = region.id;
        break;
      case 'Nord':
        regionMapping['6'] = region.id;
        break;
      case 'Nord-Ouest':
        regionMapping['7'] = region.id;
        break;
      case 'Ouest':
        regionMapping['8'] = region.id;
        break;
      case 'Sud':
        regionMapping['9'] = region.id;
        break;
      case 'Sud-Ouest':
        regionMapping['10'] = region.id;
        break;
    }
  });

  // Transformer les données des départements
  const departementData = departements.map((dep) => ({
    departement: dep.departement,
    region_id: regionMapping[dep.region_id.toString()],
  }));

  // Supprimer toutes les entrées existantes
  await knex('departement').del();

  // Insérer les nouvelles données
  await knex('departement').insert(departementData);
}
