import type { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // Création de la table 'fonction_menu_permission'
  await knex.schema.createTable('fonction_menu_permission', (table) => {
    table.increments('id').primary();
    table
      .integer('fonction_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('fonction')
      .onDelete('CASCADE');
    table
      .integer('permission_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('permission')
      .onDelete('CASCADE');
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

  return knex.raw(onUpdateTrigger('fonction_menu_permission'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('fonction_menu_permission');
}
