import ApiService from './apiService.js';
import { API_CONFIG } from './apiConfig.js';
import axios from 'axios';

class AdminService {
  static instance = null;

  static getInstance() {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getAllUsers() {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Si c'est une erreur Axios avec une réponse du serveur
        throw new Error(`Erreur ${error.response.status}: ${error.response.statusText}`);
      } else {
        // Pour les autres types d'erreurs
        throw new Error('Impossible de récupérer la liste des utilisateurs. Veuillez réessayer plus tard.');
      }
    }
  }

  async createUser(newUser) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}`, newUser);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Si c'est une erreur Axios avec une réponse du serveur
        throw error;
      } else {
        // Pour les autres types d'erreurs
        throw new Error("Impossible de créer l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async getUserById(id) {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Si c'est une erreur Axios avec une réponse du serveur
        throw error;
      } else {
        // Pour les autres types d'erreurs
        throw new Error("Impossible de sélectionner l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async activateUser(id) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.ADMIN.ACTIVATE_USER}/${id}`, { active: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Impossible d'activer l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async deactivateUser(id) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.ADMIN.DEACTIVATE_USER}/${id}`, { active: false });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Impossible de désactiver l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async resetUserPassword(id) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.ADMIN.RESET_USER_PASSWORD}/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de définir le mot de passe. Veuillez réessayer plus tard.');
      }
    }
  }

  async createUpdateMenu(menuData) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.HABILITATION.MENU}`, menuData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de créer le menu. Veuillez réessayer plus tard.');
      }
    }
  }

  async createUpdatePermission(permissionData) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.HABILITATION.PERMISSION}`, permissionData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de créer la permission. Veuillez réessayer plus tard.');
      }
    }
  }

  async createUpdateFonction(fonctionData) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.HABILITATION.FONCTION}`, fonctionData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de créer la fonction. Veuillez réessayer plus tard.');
      }
    }
  }

  async createConfigFonction(fonctionMenuPermissionData) {
    try {
      return await ApiService.post(
        `${API_CONFIG.ENDPOINTS.HABILITATION.FONCTION_MENU_PERMISSION}`,
        fonctionMenuPermissionData
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de créer la liaison fonction-menu-permission. Veuillez réessayer plus tard.');
      }
    }
  }

  async getAllMenus() {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.HABILITATION.MENU}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de récupérer la liste des menus. Veuillez réessayer plus tard.');
      }
    }
  }

  async getAllPermissions() {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.HABILITATION.PERMISSION}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de récupérer la liste des permissions. Veuillez réessayer plus tard.');
      }
    }
  }

  async getAllFonctions() {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.HABILITATION.FONCTION}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de récupérer la liste des fonctions. Veuillez réessayer plus tard.');
      }
    }
  }

  async getAllFonctionMenuPermissions() {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.HABILITATION.FONCTION_MENU_PERMISSION}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(
          'Impossible de récupérer la liste des liaisons fonction-menu-permission. Veuillez réessayer plus tard.'
        );
      }
    }
  }

  async getAllUserFonctions() {
    try {
      return await ApiService.get(`${API_CONFIG.ENDPOINTS.HABILITATION.USER_FONCTION}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error('Impossible de récupérer la liste des fonctions utilisateur. Veuillez réessayer plus tard.');
      }
    }
  }

  async createUserFonction(userFonctionData) {
    try {
      return await ApiService.post(`${API_CONFIG.ENDPOINTS.HABILITATION.USER_FONCTION}`, userFonctionData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Impossible d'attribuer la fonction à l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async disableUserFonction(id) {
    try {
      return await ApiService.put(`${API_CONFIG.ENDPOINTS.HABILITATION.USER_FONCTION}`, { id, action: 'disable' });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Impossible de désactiver la fonction de l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async enableUserFonction(id) {
    try {
      return await ApiService.put(`${API_CONFIG.ENDPOINTS.HABILITATION.USER_FONCTION}`, { id, action: 'enable' });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error("Impossible de désactiver la fonction de l'utilisateur. Veuillez réessayer plus tard.");
      }
    }
  }

  async updateUserFonction(data) {
    const { id, action } = data;

    console.log(data);

    try {
      return await ApiService.put(`${API_CONFIG.ENDPOINTS.HABILITATION.USER_FONCTION}`, { id, action });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      } else {
        throw new Error(`Impossible de mettre à jour la fonction de l'utilisateur. Veuillez réessayer plus tard.`);
      }
    }
  }
}

export default AdminService.getInstance();
