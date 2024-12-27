import type { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // Création de la table 'permission'
  await knex.schema.createTable('permission', (table) => {
    table.increments('id').primary();
    table.string('nom', 255).notNullable().unique();
    table.text('description');
    table
      .integer('menu_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('menu')
      .onDelete('CASCADE');
    table
      .integer('created_by')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });

  return knex.raw(onUpdateTrigger('permission'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('permission');
}
