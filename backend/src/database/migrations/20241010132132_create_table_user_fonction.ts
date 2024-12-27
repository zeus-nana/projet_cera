import type { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // Création de la table 'user_fonction'
  await knex.schema.createTable('user_fonction', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('fonction_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('fonction')
      .onDelete('CASCADE');
    table
      .integer('created_by')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.boolean('active').defaultTo('true');
    table.timestamps(true, true);
  });

  return knex.raw(onUpdateTrigger('user_fonction'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_fonction');
}
