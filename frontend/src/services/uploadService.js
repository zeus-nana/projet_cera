import ApiService from "./apiService.js";
import { API_CONFIG } from "./apiConfig.js";
import axios from "axios";
import FormData from "form-data";

class UploadService {
  static instance = null;

  static getInstance() {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  async uploadFiles(files) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`files`, file);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await ApiService.post(
        API_CONFIG.ENDPOINTS.FILE_PROCESSING.UPLOAD,
        formData,
        config,
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de télécharger les fichiers. Veuillez réessayer plus tard.",
        );
      }
    }
  }
}

export default UploadService.getInstance();
