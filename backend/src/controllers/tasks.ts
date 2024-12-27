import { fileProcessingQueue } from '../../bullConfig';
import processEuing from './traitement/processEuing';
import processGraphicSystemOM from './traitement/processGraphicSystemOM';
import { TypeEtat } from '../type/TypeEtat';
import processDiool from './traitement/processDiool';
import processIntouch from './traitement/processIntouch';
import processRia from './traitement/processRia';
import processAfrikomWafacash from './traitement/processAfrikomWafacash';
import processPartenaireLcp from './traitement/processPartenaireLcp';

fileProcessingQueue.process('processFile', async (job) => {
  const { filePath, chargement_id, fileName } = job.data;

  console.log(`Traitement du fichier: ${filePath}`);
  console.log(`ID du chargement: ${chargement_id.id}`);
  console.log(`Nom du fichier: ${fileName}`);

  let result;
  let message;

  try {
    switch (fileName as TypeEtat) {
      case TypeEtat.EUING:
        result = await processEuing(job);
        message = 'Fichier EUING traité avec succès';
        console.log(`Traitement EUING terminé pour le fichier: ${filePath}`);
        break;

      case TypeEtat.GRAPHIC_SYSTEM_OM:
        result = await processGraphicSystemOM(job);
        message = 'Fichier Graphic System OM traité avec succès';
        console.log(
          `Traitement Graphic System OM terminé pour le fichier: ${filePath}`,
        );
        break;

      case TypeEtat.DIOOL:
        result = await processDiool(job);
        message = 'Fichier DIOOL traité avec succès';
        console.log(`Traitement DIOOL terminé pour le fichier: ${filePath}`);
        break;

      case TypeEtat.INTOUCH:
        result = await processIntouch(job);
        message = 'Fichier INTOUCH traité avec succès';
        console.log(`Traitement INTOUCH terminé pour le fichier: ${filePath}`);
        break;

      case TypeEtat.RIA:
        result = await processRia(job);
        message = 'Fichier RIA traité avec succès';
        console.log(`Traitement RIA terminé pour le fichier: ${filePath}`);
        break;

      case TypeEtat.AFRIKOM_WAFACASH:
        result = await processAfrikomWafacash(job);
        message = 'Fichier AFRIKOM_WAFACASH traité avec succès';
        console.log(
          `Traitement AFRIKOM_WAFACASH terminé pour le fichier: ${filePath}`,
        );
        break;

      case TypeEtat.PARTENAIRE_LCP:
        result = await processPartenaireLcp(job);
        message = 'Fichier PARTENAIRE_LCP traité avec succès';
        console.log(
          `Traitement PARTENAIRE_LCP terminé pour le fichier: ${filePath}`,
        );
        break;

      default:
        // Logique de traitement pour les autres types de fichiers
        // Simulation d'un traitement générique
        await new Promise((resolve) => setTimeout(resolve, 5000));
        message = 'Fichier traité avec succès';
        console.log(
          `Traitement générique terminé pour le fichier: ${filePath}`,
        );
    }

    return {
      success: true,
      message,
      result,
    };
  } catch (error: unknown) {
    console.error(`Erreur lors du traitement du fichier ${fileName}:`, error);

    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }

    return {
      success: false,
      message: `Erreur lors du traitement: ${errorMessage}`,
    };
  }
});

// Exportation pour s'assurer que le fichier est exécuté lors de l'importation
export default {};
