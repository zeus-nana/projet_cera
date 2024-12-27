import { useQuery } from '@tanstack/react-query';
import AdminService from '../../../services/adminService.js';
import toast from 'react-hot-toast';
import axios from 'axios';

export function useGetUserFonctions() {
  const {
    data: userFonctions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userFonctions'],
    queryFn: () => AdminService.getAllUserFonctions(),
    select: (data) => data.data.data.userFonctions,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error('Impossible de récupérer les fonctions utilisateur.');
      }
    },
  });

  return { userFonctions, isLoading, error };
}
