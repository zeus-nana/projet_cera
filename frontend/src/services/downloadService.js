import ApiService from "./apiService.js";
import { API_CONFIG } from "./apiConfig.js";
import axios from "axios";

class DownloadService {
  static instance = null;

  static getInstance() {
    if (!DownloadService.instance) {
      DownloadService.instance = new DownloadService();
    }
    return DownloadService.instance;
  }

  async downloadFile(filePath) {
    try {
      const response = await ApiService.get(
        API_CONFIG.ENDPOINTS.FILE_PROCESSING.DOWNLOAD,
        {
          params: { path: filePath },
          responseType: "blob", // Important pour recevoir les données binaires
        },
      );

      // Extraire le nom du fichier du chemin de manière compatible avec tous les OS
      let fileName = filePath.split(/[\\/]/).pop();

      // Vérifier si un nom de fichier valide a été extrait
      if (!fileName) {
        console.warn(
          "Impossible d'extraire un nom de fichier valide du chemin :",
          filePath,
        );
        // Utiliser un nom par défaut ou générer un nom basé sur la date
        const defaultFileName = `download_${new Date().toISOString().replace(/[:.]/g, "-")}.bin`;
        console.log(
          "Utilisation du nom de fichier par défaut :",
          defaultFileName,
        );
        fileName = defaultFileName;
      }

      // Créer un objet URL pour le blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: "Fichier téléchargé avec succès" };
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier :", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de télécharger le fichier. Veuillez réessayer plus tard.",
        );
      }
    }
  }
}

export default DownloadService.getInstance();
