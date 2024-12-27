import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminService from '../../../services/adminService.js';
import axios from 'axios';

export function useCreateConfigFonction(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: createConfigFonction, isLoading: isCreating } = useMutation({
    mutationFn: (data) => AdminService.createConfigFonction(data),
    onSuccess: (response) => {
      // toast.success('Configuration de la fonction avec succès');
      queryClient.invalidateQueries({ queryKey: ['configFonction'] });
      onCloseModal?.();

      // Afficher les détails des permissions insérées et déjà existantes
      if (response.data && response.data.data) {
        const { insertedPermissions, alreadyExistingPermissions } = response.data.data;
        if (insertedPermissions && insertedPermissions.length > 0) {
          toast.success(`${insertedPermissions.length} nouvelle(s) permission(s) associée(s)`);
        }
        if (alreadyExistingPermissions && alreadyExistingPermissions.length > 0) {
          toast.info(`${alreadyExistingPermissions.length} permission(s) déjà associée(s)`);
        }
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error('Impossible de créer la configuration. Veuillez réessayer plus tard.');
      }
    },
  });

  return { isCreating, createConfigFonction };
}
