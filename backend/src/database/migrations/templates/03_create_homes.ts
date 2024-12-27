import { Knex } from 'knex';

/**
 * Creates the table of Homes in the database, following the schema specified.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function up(knex: Knex) {
	return knex.schema.createTable('homes', (table) => {
		table.string('user_id').references('id').inTable('users').notNullable();
		table.string('address_id').references('id').inTable('addresses').notNullable();
	});
}

/**
 * Deletes the table of Homes in the database.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function down(knex: Knex) {
	return knex.schema.dropTable('homes');
}