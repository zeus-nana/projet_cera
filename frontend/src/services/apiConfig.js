import { BASE_API_URL } from '../constants.js';

export const API_CONFIG = {
    BASE_URL: BASE_API_URL,
    ENDPOINTS: {
        AUTH: {
            LOGIN: 'auth/login',
            LOGOUT: 'auth/logout',
            VERIFY: 'auth/verify',
            CHANGE_PASSWORD: 'auth/change-password',
            CURRENT_USER: 'auth/current-user',
        },
        USERS: {
            USERS: '/users',
            CHANGE_PASSWORD: 'users/change-password',
        },
        ADMIN: {
            USERS: '/admin/users',
            ACTIVATE_USER: '/admin/activate-user',
            DEACTIVATE_USER: '/admin/deactivate-user',
            RESET_USER_PASSWORD: '/admin/reset-user-password',
            LOGIN: '/admin/login',
        },
        FILE_PROCESSING: {
            UPLOAD: '/fileProcessing/upload',
            DOWNLOAD: '/fileProcessing/download',
        },
        REPORTING: {
            DASHBOARD_DATA: '/reporting/dashboard-data',
            TRANSACTIONS: '/reporting/transactions',
            TRANSACTIONS_AGREGE: '/reporting/transactions-agrege',
            ERREURS_CHARGEMENT: '/reporting/erreurs-chargement',
            CHARGEMENTS: '/reporting/chargements',
        },
        HABILITATION: {
            MENU: '/habilitation/menu',
            PERMISSION: '/habilitation/permission',
            FONCTION: '/habilitation/fonction',
            FONCTION_MENU_PERMISSION: '/habilitation/fonction-menu-permission',
            USER_FONCTION: '/habilitation/user-fonction',
        },
        CONFIGURATION: {
            ETAT: '/configuration/etat',
            CLE_LISTE: '/configuration/cle-liste',
            LISTE: '/configuration/liste',
            LISTE_BY_CLE: '/configuration/liste-by-cle',
            AGENCE: '/configuration/agence',
            LOCALITE: '/configuration/localite',
            AGENCE_BY_CODE: '/configuration/agence/:code_agence',
            MAPPING_AGENCE_ETAT: '/configuration/mapping-agence-etat',
            MAPPING_TOGGLE_STATUS: '/configuration/mapping-agence-etat/:id/toggle-status',
            MAPPING_BY_AGENCE: '/configuration/mapping-agence-etat/agence/:agence_id',
            MAPPING_BY_ETAT: '/configuration/mapping-agence-etat/etat/:etat_id',
        },
    },
};
