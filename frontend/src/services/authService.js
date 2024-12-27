import ApiService from "./apiService.js";
import { API_CONFIG } from "./apiConfig.js";
import axios from "axios";
// import Cookies from "js-cookie";

class AuthService {
  static instance = null;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(login, password) {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        login,
        password,
      });

      // La réponse contient probablement des informations sur l'utilisateur
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de se connecter. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async logout() {
    try {
      const response = await ApiService.get(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de se déconnecter. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async verifyToken() {
    try {
      const response = await axios.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de se connecter. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const response = await ApiService.post(
        API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD,
        {
          userId,
          currentPassword,
          newPassword,
        },
      );
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de changer le mot de passe. Veuillez réessayer plus tard.",
        );
      }
    }
  }

  async getCurrentUser() {
    try {
      const response = await ApiService.get(
        API_CONFIG.ENDPOINTS.AUTH.CURRENT_USER,
      );
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          "Impossible de se connecter. Veuillez réessayer plus tard.",
        );
      }
    }
  }
}

export default AuthService.getInstance();
