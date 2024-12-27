import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Index for transactions with state 'diool' and service not 'TRANSFERT INTERNE'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_diool_non_transfert 
    ON transaction (reference) 
    WHERE etat = 'diool' AND service <> 'TRANSFERT INTERNE'
  `);

  // Index for transactions with state 'diool' and service 'TRANSFERT INTERNE'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_diool_transfert 
    ON transaction (reference, expediteur) 
    WHERE etat = 'diool' AND service = 'TRANSFERT INTERNE'
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the indexes in reverse order
  await knex.raw('DROP INDEX IF EXISTS idx_unique_transaction_diool_transfert');
  await knex.raw(
    'DROP INDEX IF EXISTS idx_unique_transaction_diool_non_transfert',
  );
}
