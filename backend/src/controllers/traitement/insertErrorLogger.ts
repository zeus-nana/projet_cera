import db from '../../database/connection';

interface ErrorDetails {
  chargementId: number;
  ligneConflictuelle: string;
  numeroLigne: number;
  error: unknown;
}

async function logError({
  chargementId,
  ligneConflictuelle,
  numeroLigne,
  error,
}: ErrorDetails): Promise<void> {
  let codeErreur = 'ERR_UNKNOWN';
  let descriptionErreur = 'An unknown error occurred';
  let pgCode: string | undefined;

  if (error instanceof Error) {
    // console.error('erreur :::', JSON.stringify(error));
    codeErreur = error.name || 'ERR_UNKNOWN';
    descriptionErreur = error.message || 'An unknown error occurred';
    if ('code' in error && typeof error.code === 'string') {
      pgCode = error.code;
    }
    if ('detail' in error && typeof error.detail === 'string') {
      descriptionErreur = error.detail;
    }

    // Extended error handling for PostgreSQL errors
    switch (pgCode) {
      case '23502':
        codeErreur = 'ERR_NULL_VALUE';
        descriptionErreur = `Valeur incompatible (NULL) à la colonne ${(error as any).column?.toUpperCase()}`;
        break;
      case '23505':
        codeErreur = 'ERR_UNIQUE_VIOLATION';
        descriptionErreur = `Violation de contrainte d'unicité: ${(error as any).detail || 'Valeur en double'}`;
        break;
      case '23503':
        codeErreur = 'ERR_FOREIGN_KEY_VIOLATION';
        descriptionErreur = `Violation de clé étrangère: ${(error as any).detail || 'Référence invalide'}`;
        break;
      case '22001':
        codeErreur = 'ERR_STRING_DATA_RIGHT_TRUNCATION';
        descriptionErreur = `Valeur trop longue pour le type de données: ${(error as any).column?.toUpperCase() || 'Colonne inconnue'}`;
        break;
      case '22003':
        codeErreur = 'ERR_NUMERIC_VALUE_OUT_OF_RANGE';
        descriptionErreur = `Valeur numérique hors de la plage autorisée: ${(error as any).detail || 'Valeur invalide'}`;
        break;
      case '22007':
        codeErreur = 'ERR_INVALID_DATETIME_FORMAT';
        descriptionErreur = `Format de date/heure invalide: ${(error as any).detail || 'Format incorrect'}`;
        break;
      case '22P02':
        codeErreur = 'ERR_INVALID_TEXT_REPRESENTATION';
        descriptionErreur = `Représentation textuelle invalide: ${(error as any).detail || 'Type de données incompatible'}`;
        break;
      case '23514':
        codeErreur = 'ERR_CHECK_VIOLATION';
        // console.log('contraintes :::', (error as any).detail);
        descriptionErreur = `Violation de contrainte: ${(error as any).constraint || 'Valeur invalide'}`;
        break;
      case '42601':
        codeErreur = 'ERR_SYNTAX_ERROR';
        descriptionErreur = `Erreur de syntaxe SQL: ${(error as any).position || 'Position inconnue'}`;
        break;
      case '42P01':
        codeErreur = 'ERR_UNDEFINED_TABLE';
        descriptionErreur = `La table spécifiée n'existe pas: ${(error as any).table || 'Nom de table inconnu'}`;
        break;
      case '42703':
        codeErreur = 'ERR_UNDEFINED_COLUMN';
        descriptionErreur = `La colonne spécifiée n'existe pas: ${(error as any).column || 'Nom de colonne inconnu'}`;
        break;
      // Add more cases as needed
    }
  } else if (typeof error === 'string') {
    // console.error('erreur :::', JSON.stringify(error));
    descriptionErreur = error;
  }

  // console.error(
  //   `Error in record (Line ${numeroLigne}): ${codeErreur} - ${descriptionErreur}`,
  // );

  try {
    const jsonParsed = JSON.parse(ligneConflictuelle);
    const ligneValues = Object.values(jsonParsed).join(', ');
    const line = numeroLigne;
    const ligneInfo = ligneValues;
    const messageErreurComplet = pgCode
      ? `(CODE ERREUR : ${pgCode}): ${descriptionErreur}`
      : `${descriptionErreur}`;

    await db('erreur_chargement_log')
      .insert({
        chargement_id: chargementId,
        ligne: line,
        contenu: db.raw('substr(?, 1, 1000)', [ligneInfo]),
        message_erreur: db.raw('substr(?, 1, 1000)', [messageErreurComplet]),
      })
      .catch((err) => {
        const pgError = err.code || 'UNKNOWN';
        const pgMessage = err.message || 'Unknown PostgreSQL error';
        // console.error(`PostgreSQL Error: ${pgError} - ${pgMessage}`);
        throw new Error(`${pgError}: ${pgMessage}`);
      });
  } catch (logError) {
    // console.error('Error logging to erreur_chargement_log:', logError);
    throw logError;
  }
}

export default logError;
