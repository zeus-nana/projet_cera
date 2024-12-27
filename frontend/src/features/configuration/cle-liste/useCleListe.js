import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import ConfigurationService from '../../../services/configurationService.js';

export function useGetCleListes() {
  const {
    data: cleListes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cleListes'],
    queryFn: async () => {
      const response = await ConfigurationService.getAllCleListes();
      return response.data.data.cle_listes;
    },
  });

  return { cleListes, isLoading, error };
}

export function useCreateUpdateCleListe(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: createUpdateCleListe, isLoading: isCreatingOrUpdating } = useMutation({
    mutationFn: (data) => ConfigurationService.createUpdateCleListe(data),
    onSuccess: (_, variables) => {
      const isEditing = Boolean(variables.id);
      toast.success(isEditing ? 'Clé de liste mise à jour avec succès' : 'Clé de liste créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['cleListes'] });
      onCloseModal?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error('Erreur lors de la création de la clé de liste.');
      }
    },
  });

  return { isCreatingOrUpdating, createUpdateCleListe };
}
