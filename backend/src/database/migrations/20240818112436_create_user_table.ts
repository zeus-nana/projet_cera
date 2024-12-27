import { Knex } from 'knex';

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */

import { onUpdateTrigger } from '../../../knexfile';

exports.up = async function (knex: Knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 255).notNullable().unique();
    table.string('login', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 255);
    table.string('department', 255);
    table.string('profile', 255);
    table.string('localisation', 255);
    table.boolean('must_reset_password').notNullable().defaultTo(true);
    table.boolean('active').notNullable().defaultTo(true);
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
  return knex.raw(onUpdateTrigger('users'));
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = async function (knex: Knex) {
  return knex.schema.dropTable('users');
};
