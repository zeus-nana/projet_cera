import { Knex } from 'knex';

/**
 * Creates the table of Administrator in the database, following the schema specified.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function up(knex: Knex) {
	return knex.schema.createTable('administrators', (table) => {
		table.string('username').primary().notNullable().unique();
		table.string('password').notNullable();
	});
}

/**
 * Deletes the table of Administrators in the database.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function down(knex: Knex) {
	return knex.schema.dropTable('administrators');
}
