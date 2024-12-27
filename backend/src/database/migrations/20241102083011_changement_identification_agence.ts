import { Knex } from 'knex';
import { onUpdateTrigger } from '../../../knexfile';

export async function up(knex: Knex): Promise<void> {
  const MIGRATION_USER_ID = 1309;

  // 1. Créer la table etat
  await knex.schema.createTable('etat', (table) => {
    table.increments('id').primary();
    table.string('etat', 100).notNullable().unique();
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);
  });
  await knex.raw(onUpdateTrigger('etat'));

  // 2. Créer la table de liaison mapping_agence_etat
  await knex.schema.createTable('mapping_agence_etat', (table) => {
    table.increments('id').primary();
    table.integer('agence_id').unsigned().references('id').inTable('agence').onDelete('CASCADE');
    table.integer('etat_id').unsigned().references('id').inTable('etat').onDelete('CASCADE');
    table.string('identifiant', 255).notNullable();
    table.boolean('active').defaultTo(true);
    table.integer('created_by').unsigned().references('id').inTable('users');
    table.integer('updated_by').unsigned().references('id').inTable('users');
    table.timestamps(true, true);

    // Index pour optimiser les recherches
    table.index(['agence_id', 'etat_id']);
  });

  // Créer l'index unique partiel
  await knex.raw(`
      CREATE UNIQUE INDEX idx_unique_identifiant_actif
          ON mapping_agence_etat (etat_id, identifiant)
          WHERE active = true
  `);

  await knex.raw(onUpdateTrigger('mapping_agence_etat'));

  // 3. Migration des données existantes
  const idColumns = [
    { column: 'id_lmt_om', etat: 'LMT OM' },
    { column: 'id_avs_momo', etat: 'AVS MOMO' },
    { column: 'id_gs_momo', etat: 'GS MOMO' },
    { column: 'id_gs_om', etat: 'GS OM' },
    { column: 'id_avs_wafacash', etat: 'AVS WAFACASH' },
    { column: 'id_bacm', etat: 'BACM' },
    { column: 'id_intouch', etat: 'INTOUCH' },
    { column: 'id_sce_wafacash', etat: 'SCE WAFACASH' },
    { column: 'id_western_ecobank', etat: 'WESTERN ECOBANK' },
    { column: 'id_afrik_com_wafacash', etat: 'AFRIK COM WAFACASH' },
    { column: 'id_western_emi', etat: 'WESTERN EMI' },
    { column: 'id_hop_international', etat: 'HOP INTERNATIONAL' },
    { column: 'id_emi_ecobank', etat: 'EMI ECOBANK' },
    { column: 'id_uba', etat: 'UBA' },
    { column: 'id_ria', etat: 'RIA' },
    { column: 'id_axa', etat: 'AXA' },
  ];

  // Insérer les etats
  for (const { etat } of idColumns) {
    await knex('etat').insert({
      etat,
      created_by: MIGRATION_USER_ID,
      updated_by: MIGRATION_USER_ID,
    });
  }

  // Migration des données pour chaque agence
  const agences = await knex('agence').select('*');

  for (const agence of agences) {
    for (const { column, etat } of idColumns) {
      if (agence[column]) {
        const [etats] = await knex('etat').where('etat', etat).select('id');

        if (etats) {
          // console.log(agence);

          await knex('mapping_agence_etat').insert({
            agence_id: agence.id,
            etat_id: etats.id,
            identifiant: agence[column],
            created_by: MIGRATION_USER_ID,
            updated_by: MIGRATION_USER_ID,
          });
        }
      }
    }
  }

  // D'abord on supprime la vue existante
  await knex.raw('DROP VIEW IF EXISTS vw_agence_localite');
  // 4. Supprimer les anciennes colonnes
  await knex.schema.alterTable('agence', (table) => {
    idColumns.forEach(({ column }) => {
      table.dropColumn(column);
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  // 1. Recréer les colonnes dans la table agence
  await knex.schema.alterTable('agence', (table) => {
    [
      'id_lmt_om',
      'id_avs_momo',
      'id_gs_momo',
      'id_gs_om',
      'id_avs_wafacash',
      'id_bacm',
      'id_intouch',
      'id_sce_wafacash',
      'id_western_ecobank',
      'id_afrik_com_wafacash',
      'id_western_emi',
      'id_hop_international',
      'id_emi_ecobank',
      'id_uba',
      'id_ria',
      'id_axa',
    ].forEach((column) => {
      table.string(column, 255);
    });
  });

  // 2. Restaurer les données
  const etats = await knex('mapping_agence_etat')
    .select('*')
    .join('etat', 'etat.id', '=', 'mapping_agence_etat.etat_id');

  for (const corr of etats) {
    const columnName = `id_${corr.etat.toLowerCase().replace(/ /g, '_')}`;
    await knex('agence')
      .where('id', corr.agence_id)
      .update({
        [columnName]: corr.identifiant,
      });
  }

  // 3. Supprimer les tables dans l'ordre inverse
  await knex.schema.dropTableIfExists('mapping_agence_etat');
  await knex.schema.dropTableIfExists('etat');

  // Suppression de la vue
  await knex.raw('DROP VIEW IF EXISTS vw_agence_localite');

  await knex.raw(`
    CREATE OR REPLACE VIEW vw_agence_localite AS
    SELECT 
      a.id,
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
