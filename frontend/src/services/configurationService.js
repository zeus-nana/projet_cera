import ApiService from './apiService.js';
import { API_CONFIG } from './apiConfig.js';
import axios from 'axios';

class ConfigurationService {
    static instance = null;

    static getInstance() {
        if (!ConfigurationService.instance) {
            ConfigurationService.instance = new ConfigurationService();
        }
        return ConfigurationService.instance;
    }

    // Services pour les états
    async getAllEtats() {
        try {
            return await ApiService.get(`${API_CONFIG.ENDPOINTS.CONFIGURATION.ETAT}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de récupérer la liste des états. Veuillez réessayer plus tard.');
            }
        }
    }

    async createUpdateEtat(etatData) {
        try {
            return await ApiService.post(`${API_CONFIG.ENDPOINTS.CONFIGURATION.ETAT}`, etatData);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error("Impossible de créer ou mettre à jour l'état. Veuillez réessayer plus tard.");
            }
        }
    }

    // Services pour les clés de liste
    async getAllCleListes() {
        try {
            return await ApiService.get(`${API_CONFIG.ENDPOINTS.CONFIGURATION.CLE_LISTE}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de récupérer les clés de liste. Veuillez réessayer plus tard.');
            }
        }
    }

    async createUpdateCleListe(cleListeData) {
        try {
            return await ApiService.post(`${API_CONFIG.ENDPOINTS.CONFIGURATION.CLE_LISTE}`, cleListeData);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de créer ou mettre à jour la clé de liste. Veuillez réessayer plus tard.');
            }
        }
    }

    // Services pour les listes
    async getAllListes() {
        try {
            return await ApiService.get(`${API_CONFIG.ENDPOINTS.CONFIGURATION.LISTE}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de récupérer les listes. Veuillez réessayer plus tard.');
            }
        }
    }

    async createUpdateListe(listeData) {
        try {
            return await ApiService.post(`${API_CONFIG.ENDPOINTS.CONFIGURATION.LISTE}`, listeData);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de créer ou mettre à jour la liste. Veuillez réessayer plus tard.');
            }
        }
    }

    async getListesByCleListe(libelle) {
        try {
            const params = { libelle };
            return await ApiService.get(API_CONFIG.ENDPOINTS.CONFIGURATION.LISTE_BY_CLE, { params });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de récupérer les listes pour cette clé. Veuillez réessayer plus tard.');
            }
        }
    }

    // Services pour les agences
    async getAllAgences() {
        try {
            return await ApiService.get(`${API_CONFIG.ENDPOINTS.CONFIGURATION.AGENCE}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de récupérer la liste des agences. Veuillez réessayer plus tard.');
            }
        }
    }

    async getAgenceByCode(codeAgence) {
        try {
            return await ApiService.get(
                `${API_CONFIG.ENDPOINTS.CONFIGURATION.AGENCE_BY_CODE.replace(':code_agence', codeAgence)}`
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error("Impossible de récupérer l'agence. Veuillez réessayer plus tard.");
            }
        }
    }

    async createUpdateAgence(agenceData) {
        try {
            return await ApiService.post(`${API_CONFIG.ENDPOINTS.CONFIGURATION.AGENCE}`, agenceData);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error("Impossible de créer ou mettre à jour l'agence. Veuillez réessayer plus tard.");
            }
        }
    }

    // Services pour les localités
    async getAllLocalites() {
        try {
            return await ApiService.get(`${API_CONFIG.ENDPOINTS.CONFIGURATION.LOCALITE}`);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de récupérer la liste des agences. Veuillez réessayer plus tard.');
            }
        }
    }

    // Services pour le mapping agence-état
    async getAllMappingsByAgence(agenceId) {
        try {
            return await ApiService.get(
                `${API_CONFIG.ENDPOINTS.CONFIGURATION.MAPPING_BY_AGENCE.replace(':agence_id', agenceId)}`
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error("Impossible de récupérer les mappings de l'agence. Veuillez réessayer plus tard.");
            }
        }
    }

    async getAllMappingsByEtat(etatId) {
        try {
            return await ApiService.get(
                `${API_CONFIG.ENDPOINTS.CONFIGURATION.MAPPING_BY_ETAT.replace(':etat_id', etatId)}`
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error("Impossible de récupérer les mappings de l'état. Veuillez réessayer plus tard.");
            }
        }
    }

    async createUpdateMapping(mappingData) {
        try {
            return await ApiService.post(`${API_CONFIG.ENDPOINTS.CONFIGURATION.MAPPING_AGENCE_ETAT}`, mappingData);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de créer ou mettre à jour le mapping. Veuillez réessayer plus tard.');
            }
        }
    }

    async toggleMappingStatus(mappingId, status) {
        try {
            return await ApiService.patch(
                `${API_CONFIG.ENDPOINTS.CONFIGURATION.MAPPING_TOGGLE_STATUS.replace(':id', mappingId)}`,
                { active: status }
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw error;
            } else {
                throw new Error('Impossible de modifier le statut du mapping. Veuillez réessayer plus tard.');
            }
        }
    }
}

export default ConfigurationService.getInstance();
