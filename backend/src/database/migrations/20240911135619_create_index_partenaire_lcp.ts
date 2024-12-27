import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Index pour les transactions avec l'état 'partenaire_lcp'
  await knex.raw(`
    CREATE UNIQUE INDEX idx_unique_transaction_partenaire_lcp
    ON transaction (reference, service)
    WHERE etat = 'partenaire_lcp'
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Suppression de l'index
  await knex.raw('DROP INDEX IF EXISTS idx_unique_transaction_partenaire_lcp');
}
