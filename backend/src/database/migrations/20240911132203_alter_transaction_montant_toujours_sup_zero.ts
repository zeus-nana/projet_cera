import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE transaction
    ADD CONSTRAINT check_montant_non_negatif
    CHECK (montant >= 0)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE transaction
    DROP CONSTRAINT check_montant_non_negatif
  `);
}
