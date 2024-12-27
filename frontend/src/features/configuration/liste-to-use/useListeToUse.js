import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import ConfigurationService from '../../../services/configurationService.js';

export function useGetAllListes() {
    const {
        data: listes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['listes'],
        queryFn: async () => {
            const response = await ConfigurationService.getAllListes();
            return response.data.data.listes;
        },
    });

    return { listes, isLoading, error };
}

export function useGetListesByCle(libelle) {
    const {
        data: listes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['listes', libelle],
        queryFn: async () => {
            if (!libelle) {
                throw new Error('Le libellé de la clé est requis');
            }
            const response = await ConfigurationService.getListesByCleListe(libelle);
            return response.data.data.listes;
        },
        enabled: Boolean(libelle),
        retry: false, // désactive les réessais en cas d'erreur
    });

    return { listes, isLoading, error };
}

export function useCreateUpdateListe(onCloseModal) {
    const queryClient = useQueryClient();

    const { mutate: createUpdateListe, isLoading: isCreatingOrUpdating } = useMutation({
        mutationFn: (data) => ConfigurationService.createUpdateListe(data),
        onSuccess: (_, variables) => {
            const isEditing = Boolean(variables.id);
            toast.success(isEditing ? 'Liste mise à jour avec succès' : 'Liste créée avec succès');

            // Invalider toutes les requêtes liées aux listes
            queryClient.invalidateQueries({ queryKey: ['listes'] });

            // Si la clé de liste est fournie, invalider aussi les listes spécifiques à cette clé
            if (variables.cle_liste_id) {
                queryClient.invalidateQueries({
                    queryKey: ['listes', variables.cle_liste_id],
                });
            }

            onCloseModal?.();
        },
        onError: (error) => {
            if (axios.isAxiosError(error) && error.response?.data) {
                toast.error(`Erreur: ${error.response.data.message}`);
            } else {
                toast.error('Erreur lors de la création de la liste.');
            }
        },
    });

    return { isCreatingOrUpdating, createUpdateListe };
}
