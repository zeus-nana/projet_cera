import { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('service', (table) => {
    // Clé primaire
    table.increments('id').primary();

    // Champs métier
    table.string('service', 200).notNullable();
    table.string('partenaire', 100).notNullable();
    table.string('categorie', 100).notNullable();
    table.string('sous_categorie', 100).notNullable();
    table.enum('sens', ['e', 's']).notNullable().comment("'e' pour entrée, 's' pour sortie");
    table.string('responsable', 100).notNullable();

    // Clé étrangère
    table.integer('etat_id').unsigned().references('id').inTable('etat').onDelete('RESTRICT').notNullable();

    // Champs de traçabilité
    table.integer('created_by').unsigned().references('id').inTable('users').notNullable();
    table.integer('updated_by').unsigned().references('id').inTable('users').notNullable();
    table.timestamps(true, true);

    // Index pour optimiser les recherches
    table.index(['partenaire', 'categorie', 'sous_categorie']);
    table.index(['etat_id']);

    // Contrainte d'unicité
    table.unique(['partenaire', 'categorie', 'sous_categorie', 'service']);
  });

  // Ajout du trigger pour la mise à jour automatique du updated_at
  await knex.raw(onUpdateTrigger('service'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('service');
}
