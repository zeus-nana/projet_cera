import { Knex } from 'knex';

/**
 * Creates the table of Addresses in the database, following the schema specified.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function up(knex: Knex) {
	return knex.schema.createTable('addresses', (table) => {
		table.string('id').primary().notNullable().unique();
		table.string('address').notNullable();
		table.string('number').notNullable();
		table.string('complement');
		table.string('zipcode').notNullable();
		table.string('city').notNullable();
		table.string('state').notNullable();
	});
}

/**
 * Deletes the table of Addresses in the database.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function down(knex: Knex) {
	return knex.schema.dropTable('addresses');
}