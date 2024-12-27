import { useQuery } from '@tanstack/react-query';
import AdminService from '../../../services/adminService.js';

export function useGetPermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: AdminService.getAllPermissions,
  });
}
