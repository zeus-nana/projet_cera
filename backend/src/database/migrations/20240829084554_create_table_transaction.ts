import { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transaction', (table) => {
    table.increments('id').primary();
    table
      .integer('chargement_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('chargement');
    table.string('etat', 255).notNullable();
    table.string('service', 255);
    table.string('reference', 255);
    table.timestamp('date_operation').notNullable();
    table
      .string('sens', 1)
      .notNullable()
      .comment('soit e pour entrée ou s pour sortie');
    table.decimal('montant', 65, 6).notNullable();
    table.decimal('frais_ht', 65, 6);
    table.decimal('tta', 65, 6);
    table.decimal('tva', 65, 6);
    table.decimal('frais_ttc', 65, 6);
    table.decimal('commission', 65, 6);
    table.string('statut_operation', 50);
    table.string('id_operation', 255);
    table.string('expediteur', 255);
    table.string('beneficiaire', 255);
    table.string('guichet', 255);
    table.string('agence', 255);
    table.string('compagnie', 255);
    table.string('pays', 255);
    table.string('guichet_decharge', 255);
    table.string('agence_decharge', 255);
    table.string('compagnie_decharge', 255);
    table.string('pays_decharge', 255);
    table.string('partenaire', 255).notNullable();
    table.string('categorie', 50).notNullable();
    table.string('sous_categorie', 50).notNullable();
    table.string('responsable', 50).notNullable();
    table.string('application', 100).notNullable();
    table.string('v_hv', 3).notNullable();
    table.string('region', 50).notNullable();
    table.string('departement', 50).notNullable();
    table.string('commune', 50).notNullable();
    table.string('code_agence', 4).notNullable();
    table.string('pole', 50).notNullable();

    // Champs extra
    for (let i = 1; i <= 30; i++) {
      table.string(`extra_${i}`, 255);
    }

    // timestamps
    table.timestamps(true, true);
  });

  // Assurez-vous que la fonction onUpdateTrigger est définie et importée correctement
  return knex.raw(onUpdateTrigger('transaction'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transaction');
}
