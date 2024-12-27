import type { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // Création de la table 'cle_liste'
  await knex.schema.createTable('cle_liste', (table) => {
    table.increments('id').primary();
    table.string('libelle', 255).notNullable().unique();
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });

  // Création de la table 'liste_to_use'
  await knex.schema.createTable('liste_to_use', (table) => {
    table.increments('id').primary();
    table.string('code', 50).notNullable();
    table.string('libelle', 255).notNullable();
    table.integer('cle_liste_id').unsigned().notNullable().references('id').inTable('cle_liste');
    table.integer('created_by').unsigned().notNullable().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });

  // Ajout des triggers pour la mise à jour automatique des timestamps
  await knex.raw(onUpdateTrigger('cle_liste'));
  return knex.raw(onUpdateTrigger('liste_to_use'));
}

export async function down(knex: Knex): Promise<void> {
  // Suppression des tables dans l'ordre inverse de leur création
  await knex.schema.dropTable('liste_to_use');
  await knex.schema.dropTable('cle_liste');
}
