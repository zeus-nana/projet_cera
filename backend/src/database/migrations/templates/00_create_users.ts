import { Knex } from 'knex';

/**
 * Creates the table of Users in the database, following the schema specified.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function up(knex: Knex) {
	return knex.schema.createTable('users', (table) => {
		table.string('id').primary().notNullable().unique();
		table.string('name').notNullable();
		table.string('phone').notNullable();
		table.string('email').notNullable();
		table.integer('age').notNullable();
		table.decimal('weight').notNullable();
	});
}

/**
 * Deletes the table of Users in the database.
 * 
 * @param knex The database controller used to create the table schema.
 * @returns The schema of the table to be created.
 */
export async function down(knex: Knex) {
	return knex.schema.dropTable('users');
}
