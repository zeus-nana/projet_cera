import { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('mapping', (table) => {
    table.increments('id').primary();
    table.string('etat', 255).notNullable().unique();
    table.jsonb('mapping').notNullable();
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });

  // trigger pour la mise à jour automatique
  return knex.raw(onUpdateTrigger('mapping'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('mapping');
}
