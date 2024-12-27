import type { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // Création de la table 'erreur_chargement_log'
  await knex.schema.createTableIfNotExists('erreur_chargement_log', (table) => {
    table.increments('id').primary();
    table.integer('ligne').notNullable();
    table.string('contenu', 1000).notNullable();
    table.string('message_erreur', 1000).notNullable();
    table
      .integer('chargement_id')
      .unsigned()
      .references('id')
      .inTable('chargement');
    table.timestamps(true, true);
  });

  return knex.raw(onUpdateTrigger('erreur_chargement_log'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('erreur_chargement_log');
}
