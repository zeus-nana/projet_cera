import { useQuery } from '@tanstack/react-query';
import AdminService from '../../../services/adminService.js';

export function useGetConfigFonction() {
  return useQuery({
    queryKey: ['configFonction'],
    queryFn: AdminService.getAllFonctionMenuPermissions,
  });
}
