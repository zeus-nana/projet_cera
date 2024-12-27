import { useQuery } from '@tanstack/react-query';
import AdminService from '../../../services/adminService.js';

export function useGetFonctions() {
  return useQuery({
    queryKey: ['fonctions'],
    queryFn: AdminService.getAllFonctions,
  });
}
