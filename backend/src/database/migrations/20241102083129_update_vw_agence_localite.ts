import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // D'abord on supprime la vue existante
  await knex.raw('DROP VIEW IF EXISTS vw_agence_localite');

  // Ensuite on crée la nouvelle vue
  await knex.raw(`
    CREATE VIEW vw_agence_localite AS
    SELECT 
      a.id,
      a.code_agence,
      a.agence,
      a.gesuni,
      a.reseau,
      a.pole,
      a.type_agence,
      a.v_hv,
      a.telephone,
      a.commune_id,
      a.created_by,
      a.updated_by,
      a.created_at,
      a.updated_at,
      ca.commune,
      ca.arrondissement,
      d.departement,
      r.region,
      r.chef_lieu,
      (
        SELECT json_agg(json_build_object(
          'etat', cp.etat,
          'identifiant', ac.identifiant
        ))
        FROM mapping_agence_etat ac
        JOIN etat cp ON cp.id = ac.etat_id
        WHERE ac.agence_id = a.id
      ) as correspondances
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

  // Recréation de la vue originale
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
