import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
        CREATE OR REPLACE PROCEDURE insert_transactions(
            p_transactions JSONB,
            OUT p_success BOOLEAN,
            OUT p_error_code TEXT,
            OUT p_error_message TEXT
        )
        LANGUAGE plpgsql
        AS $$
        DECLARE
            v_transaction JSONB;
            v_column_name TEXT;
            v_column_value TEXT;
            v_insert_columns TEXT := '';
            v_insert_values TEXT := '';
            v_sql TEXT;
            v_error_code TEXT;
            v_error_message TEXT;
            v_chargement_id INTEGER;
            v_etat TEXT;
            v_statut TEXT;
            v_service TEXT;
            v_reference TEXT;
            v_error BOOLEAN := FALSE;
        BEGIN
            -- Initialiser les paramètres de sortie
            p_success := TRUE;
            p_error_code := NULL;
            p_error_message := NULL;

            -- Commencer la transaction
            BEGIN
                -- Extraire le chargement_id de la première transaction
                v_chargement_id := (p_transactions->0->>'chargement_id')::INTEGER;

                -- Parcourir chaque transaction dans le tableau JSON
                FOR v_transaction IN SELECT jsonb_array_elements(p_transactions)
                LOOP
                    v_insert_columns := '';
                    v_insert_values := '';
                    
                    -- Construire la requête d'insertion dynamiquement
                    FOR v_column_name, v_column_value IN SELECT * FROM jsonb_each_text(v_transaction)
                    LOOP
                        IF v_insert_columns <> '' THEN
                            v_insert_columns := v_insert_columns || ', ';
                            v_insert_values := v_insert_values || ', ';
                        END IF;
                        
                        v_insert_columns := v_insert_columns || quote_ident(v_column_name);
                        v_insert_values := v_insert_values || quote_nullable(v_column_value);
                    END LOOP;
                    
                    -- Construire et exécuter la requête SQL
                    v_sql := format('INSERT INTO transaction (%s) VALUES (%s)', v_insert_columns, v_insert_values);
                    
                    BEGIN
                        EXECUTE v_sql;
                    EXCEPTION 
                        WHEN unique_violation THEN
                            -- Extraire les valeurs nécessaires seulement en cas de violation d'unicité
                            v_etat := v_transaction->>'etat';
                            v_statut := v_transaction->>'statut';
                            v_service := v_transaction->>'service';
                            v_reference := v_transaction->>'reference';

                            IF v_etat = 'euing' THEN
                                -- Mettre à jour le statut si c'est une violation de contrainte d'unicité pour etat='euing'
                                UPDATE transaction 
                                SET statut = v_statut 
                                WHERE etat = 'euing' AND service = v_service AND reference = v_reference;
                            ELSE
                                -- Pour les autres violations d'unicité, enregistrer l'erreur
                                GET STACKED DIAGNOSTICS 
                                    v_error_code = RETURNED_SQLSTATE,
                                    v_error_message = MESSAGE_TEXT;
                                INSERT INTO erreur_chargement_log (contenu, message_erreur, chargement_id)
                                VALUES (v_transaction::TEXT, v_error_code || ': ' || v_error_message, v_chargement_id);
                                v_error := TRUE;
                            END IF;
                        WHEN OTHERS THEN
                            -- Pour toutes les autres erreurs, enregistrer dans erreur_chargement_log
                            GET STACKED DIAGNOSTICS 
                                v_error_code = RETURNED_SQLSTATE,
                                v_error_message = MESSAGE_TEXT;
                            INSERT INTO erreur_chargement_log (contenu, message_erreur, chargement_id)
                            VALUES (v_transaction::TEXT, v_error_code || ': ' || v_error_message, v_chargement_id);
                            v_error := TRUE;
                    END;
                END LOOP;

                -- Mettre à jour le statut du chargement à 't' (terminé) seulement s'il n'y a pas eu d'erreur
                IF NOT v_error THEN
                    UPDATE chargement SET statut = 't' WHERE id = v_chargement_id;
                    -- Commit la transaction si tout s'est bien passé
                    COMMIT;
                ELSE
                    -- Rollback la transaction s'il y a eu une erreur
                    ROLLBACK;
                    p_success := FALSE;
                    p_error_code := '50000'; -- Code générique pour "erreurs multiples"
                    p_error_message := 'Des erreurs se sont produites pendant le traitement. Consultez la table erreur_chargement_log pour plus de détails.';
                END IF;
            EXCEPTION
                WHEN OTHERS THEN
                    -- En cas d'erreur non gérée, on fait un rollback
                    ROLLBACK;
                    p_success := FALSE;
                    GET STACKED DIAGNOSTICS 
                        p_error_code = RETURNED_SQLSTATE,
                        p_error_message = MESSAGE_TEXT;
            END;
        END;
        $$;
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
        DROP PROCEDURE IF EXISTS insert_transactions(JSONB, OUT BOOLEAN, OUT TEXT, OUT TEXT);
    `);
}
