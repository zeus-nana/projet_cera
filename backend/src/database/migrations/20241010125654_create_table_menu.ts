import type { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // Création de la table 'menu'
  await knex.schema.createTable('menu', (table) => {
    table.increments('id').primary();
    table.string('nom', 255).notNullable().unique();
    table.text('description');
    table
      .integer('created_by')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });

  return knex.raw(onUpdateTrigger('menu'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('menu');
}
