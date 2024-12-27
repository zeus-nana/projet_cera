import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from 'axios';
import AdminService from '../../services/adminService.js';

export function useGetUsers() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => AdminService.getAllUsers(),
    select: (data) => data.data.data.users,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error('Impossible de récupérer la liste des utilisateurs.');
      }
    },
  });

  return { users, isLoading, error };
}
