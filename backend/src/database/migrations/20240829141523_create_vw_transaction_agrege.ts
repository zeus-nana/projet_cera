import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE VIEW vw_transaction_agrege AS
    SELECT 
        ROW_NUMBER() OVER (ORDER BY DATE(date_operation)) AS ligne,
        categorie,
        sous_categorie,
        statut_operation,
        responsable,
        partenaire,
        application,
        TO_CHAR(DATE(date_operation), 'YYYY-MM-DD') AS date_operation,
        service,
        SUM(montant) AS montant,
        SUM(frais_ttc) AS frais_ttc,
        SUM(frais_ht) AS frais_ht,
        SUM(tva) AS tva,
        SUM(commission) AS commission,
        COUNT(code_agence) AS nombre_operation,
        code_agence,
        agence,
        v_hv,
        region,
        departement,
        commune
    FROM 
        transaction
    GROUP BY 
        categorie,
        sous_categorie,
        statut_operation,
        responsable,
        partenaire,
        application,
        DATE(date_operation),
        service,
        code_agence,
        agence,
        v_hv,
        region,
        departement,
        commune;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP VIEW IF EXISTS vw_transaction_agrege;`);
}
