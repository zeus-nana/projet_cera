import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminService from '../../../services/adminService.js';
import axios from 'axios';

export function useCreateUpdateFonction(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: createUpdateFonction, isLoading: isCreatingOrUpdating } = useMutation({
    mutationFn: (data) => AdminService.createUpdateFonction(data),
    onSuccess: (_, variables) => {
      const isEditing = Boolean(variables.id);
      toast.success(isEditing ? 'Fonction mise à jour avec succès' : 'Fonction créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['fonctions'] });
      onCloseModal?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error(`Erreur lors de la création de la fonction.`);
      }
    },
  });

  return { isCreatingOrUpdating, createUpdateFonction };
}
