import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_euing 
    ON transaction (service, reference)
    WHERE etat = 'euing'
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX idx_unique_transaction_euing');
}
