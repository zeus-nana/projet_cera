import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminService from '../../../services/adminService.js';
import axios from 'axios';

export function useCreateUpdatePermission(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: createUpdatePermission, isLoading: isCreatingOrUpdating } = useMutation({
    mutationFn: (data) => AdminService.createUpdatePermission(data),
    onSuccess: (_, variables) => {
      const isEditing = Boolean(variables.id);
      toast.success(isEditing ? 'Permission mise à jour avec succès' : 'Permission créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      onCloseModal?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error(`Erreur lors de la création/mise à jour de la permission.`);
      }
    },
  });

  return { isCreatingOrUpdating, createUpdatePermission };
}
