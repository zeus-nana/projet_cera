import ApiService from "./apiService.js";
import { API_CONFIG } from "./apiConfig.js";
import axios from "axios";

class ReportingService {
  static instance = null;

  static getInstance() {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  async getTransactionsByDate(startDate, endDate) {
    try {
      return await ApiService.get(
        `${API_CONFIG.ENDPOINTS.REPORTING.TRANSACTIONS}`,
        {
          params: { startDate, endDate },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Si c'est une erreur Axios avec une réponse du serveur
        throw new Error(
          `Erreur ${error.response.status}: ${error.response.statusText}`,
        );
      } else {
        // Pour les autres types d'erreurs
        throw new Error(
          "Impossible de récupérer les transactions. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async getErrorChargementByID(chargement_id) {
    try {
      return await ApiService.get(
        `${API_CONFIG.ENDPOINTS.REPORTING.ERREURS_CHARGEMENT}`,
        {
          params: { chargement_id },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Erreur ${error.response.status}: ${error.response.statusText}`,
        );
      } else {
        throw new Error(
          "Impossible de récupérer les erreurs de chargement. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async getChargementByDate(startDate, endDate) {
    try {
      return await ApiService.get(
        `${API_CONFIG.ENDPOINTS.REPORTING.CHARGEMENTS}`,
        {
          params: { startDate, endDate },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Erreur ${error.response.status}: ${error.response.statusText}`,
        );
      } else {
        throw new Error(
          "Impossible de récupérer les chargements. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async getTransactionsAgregeByDate(startDate, endDate) {
    console.log("date filtre : ", startDate, endDate);
    try {
      return await ApiService.get(
        `${API_CONFIG.ENDPOINTS.REPORTING.TRANSACTIONS_AGREGE}`,
        {
          params: { startDate, endDate },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Erreur ${error.response.status}: ${error.response.statusText}`,
        );
      } else {
        throw new Error(
          "Impossible de récupérer les transactions agrégées. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async getDashboardData(startDate, endDate) {
    console.log("date filtre : ", startDate, endDate);
    try {
      return await ApiService.get(
        `${API_CONFIG.ENDPOINTS.REPORTING.DASHBOARD_DATA}`,
        {
          params: { startDate, endDate },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Erreur ${error.response.status}: ${error.response.statusText}`,
        );
      } else {
        throw new Error(
          "Impossible de récupérer les transactions agrégées. Veuillez réessayer plus tard.",
        );
      }
    }
  }
}

export default ReportingService.getInstance();
