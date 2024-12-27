import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import ConfigurationService from '../../../services/configurationService.js';

// Hooks pour la gestion des agences
export function useGetAllAgences() {
    const {
        data: agences,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['agences'],
        queryFn: async () => {
            const response = await ConfigurationService.getAllAgences();

            return response.data.data.agences;
        },
    });

    return { agences, isLoading, error };
}

export function useGetAgenceByCode(codeAgence) {
    const {
        data: agence,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['agences', codeAgence],
        queryFn: async () => {
            const response = await ConfigurationService.getAgenceByCode(codeAgence);
            return response.data.data.agence;
        },
        enabled: Boolean(codeAgence),
    });

    return { agence, isLoading, error };
}

export function useCreateUpdateAgence(onCloseModal) {
    const queryClient = useQueryClient();

    const { mutate: createUpdateAgence, isLoading: isCreatingOrUpdating } = useMutation({
        mutationFn: (data) => ConfigurationService.createUpdateAgence(data),
        onSuccess: (_, variables) => {
            const isEditing = Boolean(variables.id);
            toast.success(isEditing ? 'Agence mise à jour avec succès' : 'Agence créée avec succès');

            // Invalider toutes les requêtes liées aux agences
            queryClient.invalidateQueries({ queryKey: ['agences'] });

            // Si on a le code_agence, invalider aussi la requête spécifique
            if (variables.code_agence) {
                queryClient.invalidateQueries({
                    queryKey: ['agences', variables.code_agence],
                });
            }

            onCloseModal?.();
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.data) {
                toast.error(`Erreur: ${error.response.data.message}`);
            } else {
                toast.error("Erreur lors de la création/mise à jour de l'agence.");
            }
        },
    });

    return { createUpdateAgence, isCreatingOrUpdating };
}
