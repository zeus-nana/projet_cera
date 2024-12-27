import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Index unique pour les transactions avec l'état 'intouch'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_intouch
    ON transaction (reference)
    WHERE etat = 'intouch'
  `);

  // Index unique pour les transactions avec l'état 'graphic_system_om'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_graphic_system_om
    ON transaction (reference, guichet)
    WHERE etat = 'graphic_system_om'
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Suppression des index
  await knex.raw('DROP INDEX IF EXISTS idx_unique_transaction_intouch');
  await knex.raw(
    'DROP INDEX IF EXISTS idx_unique_transaction_graphic_system_om',
  );
}
