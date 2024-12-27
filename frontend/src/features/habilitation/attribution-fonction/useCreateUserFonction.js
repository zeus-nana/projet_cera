import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AdminService from '../../../services/adminService.js';
import axios from 'axios';

export function useCreateUserFonction(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: createUserFonction, isLoading: isCreating } = useMutation({
    mutationFn: (data) => AdminService.createUserFonction(data),
    onSuccess: () => {
      toast.success('Fonction attribuée avec succès');
      queryClient.invalidateQueries({ queryKey: ['userFonctions'] });
      onCloseModal?.();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error("Impossible d'attribuer la fonction. Veuillez réessayer plus tard.");
      }
    },
  });

  return { isCreating, createUserFonction };
}
