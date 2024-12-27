import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Vide la table 'region' avant d'insérer les nouvelles données
  await knex('region').del();

  // Insère les données de région
  await knex('region').insert([
    { region: 'Adamaoua', chef_lieu: 'Ngaoundéré' },
    { region: 'Centre', chef_lieu: 'Yaoundé' },
    { region: 'Est', chef_lieu: 'Bertoua' },
    { region: 'Extreme-Nord', chef_lieu: 'Maroua' },
    { region: 'Littoral', chef_lieu: 'Douala' },
    { region: 'Nord', chef_lieu: 'Garoua' },
    { region: 'Nord-Ouest', chef_lieu: 'Bamenda' },
    { region: 'Ouest', chef_lieu: 'Bafoussam' },
    { region: 'Sud', chef_lieu: 'Ebolowa' },
    { region: 'Sud-Ouest', chef_lieu: 'Buea' },
  ]);
}
