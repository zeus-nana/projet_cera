import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Index for transactions with state 'ria'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_ria
    ON transaction (id_operation,service) 
    WHERE etat = 'ria'
  `);

  // Index for transactions with state 'afrikom_wafacash'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_afrikom_wafacash
    ON transaction (reference, service)
    WHERE etat = 'afrikom_wafacash'
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the indexes in reverse order
  await knex.raw(
    'DROP INDEX IF EXISTS idx_unique_transaction_afrikom_wafacash',
  );
  await knex.raw('DROP INDEX IF EXISTS idx_unique_transaction_ria');
}
