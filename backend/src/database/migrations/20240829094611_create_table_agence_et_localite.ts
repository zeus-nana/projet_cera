import { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  // 1. Création de la table 'region'
  await knex.schema.createTable('region', (table) => {
    table.increments('id').primary();
    table.string('region', 50);
    table.string('chef_lieu', 100);
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
  await knex.raw(onUpdateTrigger('region'));

  // 2. Création de la table 'departement'
  await knex.schema.createTable('departement', (table) => {
    table.increments('id').primary();
    table.string('departement', 50);
    table.integer('region_id').unsigned().references('id').inTable('region');
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
  await knex.raw(onUpdateTrigger('departement'));

  // 3. Création de la table 'commune_arrondissement'
  await knex.schema.createTable('commune_arrondissement', (table) => {
    table.increments('id').primary();
    table.string('commune', 50);
    table.string('arrondissement', 50);
    table
      .integer('departement_id')
      .unsigned()
      .references('id')
      .inTable('departement');
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
  await knex.raw(onUpdateTrigger('commune_arrondissement'));

  // 4. Création de la table 'agence'
  await knex.schema.createTable('agence', (table) => {
    table.increments('id').primary();
    table.string('code_agence', 5);
    table.string('agence', 255);
    table.string('gesuni', 255);
    table.string('reseau', 255);
    table.string('pole', 50);
    table.string('type_agence', 255);
    table.string('v_hv', 255);
    table.string('telephone', 255);
    table.string('id_lmt_om', 255);
    table.string('id_avs_momo', 255);
    table.string('id_gs_momo', 255);
    table.string('id_gs_om', 255);
    table.string('id_avs_wafacash', 255);
    table.string('id_bacm', 255);
    table.string('id_intouch', 255);
    table.string('id_sce_wafacash', 255);
    table
      .integer('commune_id')
      .unsigned()
      .references('id')
      .inTable('commune_arrondissement');
    table.string('id_western_ecobank', 255);
    table.string('id_afrik_com_wafacash', 255);
    table.string('id_western_emi', 255);
    table.string('id_hop_international', 255);
    table.string('id_emi_ecobank', 255);
    table.string('id_uba', 255);
    table.string('id_ria', 255);
    table.string('id_axa', 255);
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
  await knex.raw(onUpdateTrigger('agence'));

  // 5. Création de la vue 'agence_details'
  await knex.raw(`
    CREATE VIEW vw_agence_localite AS
    SELECT 
      a.*,
      ca.commune,
      ca.arrondissement,
      d.departement,
      r.region,
      r.chef_lieu
    FROM 
      agence a
    LEFT JOIN 
      commune_arrondissement ca ON a.commune_id = ca.id
    LEFT JOIN 
      departement d ON ca.departement_id = d.id
    LEFT JOIN 
      region r ON d.region_id = r.id
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Suppression de la vue
  await knex.raw('DROP VIEW IF EXISTS vw_agence_localite');

  // Suppression des tables dans l'ordre inverse de leur création
  await knex.schema.dropTableIfExists('agence');
  await knex.schema.dropTableIfExists('commune_arrondissement');
  await knex.schema.dropTableIfExists('departement');
  await knex.schema.dropTableIfExists('region');
}
