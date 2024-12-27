import { parse } from 'csv-parse/sync';
import { CsvError } from 'csv-parse';

interface CsvRow {
  [key: string]: string;
}

function csvToJsonParser(csvContent: string): CsvRow[] {
  const options = {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    skip_records_with_empty_values: true,
  };

  try {
    const records: CsvRow[] = parse(csvContent, options);

    // Normaliser les en-têtes
    const normalizedRecords = records.map((record) => {
      const normalizedRecord: CsvRow = {};
      for (const [key, value] of Object.entries(record)) {
        const normalizedKey = normalizeHeader(key);
        normalizedRecord[normalizedKey] = value;
      }
      return normalizedRecord;
    });

    return normalizedRecords;
  } catch (error: unknown) {
    if (error instanceof CsvError) {
      console.error('Erreur lors du parsing du CSV:', error.message);
      throw new Error(`Erreur de parsing CSV: ${error.message}`);
    } else if (error instanceof Error) {
      console.error(
        'Erreur inattendue lors du traitement du CSV:',
        error.message,
      );
      throw new Error(
        `Erreur inattendue lors du traitement du CSV: ${error.message}`,
      );
    } else {
      console.error('Erreur inconnue lors du traitement du CSV');
      throw new Error('Erreur inconnue lors du traitement du CSV');
    }
  }
}

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export default csvToJsonParser;
