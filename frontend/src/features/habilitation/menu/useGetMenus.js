import { useQuery } from '@tanstack/react-query';
import AdminService from '../../../services/adminService.js';

export function useGetMenus() {
  return useQuery({
    queryKey: ['menus'],
    queryFn: AdminService.getAllMenus,
  });
}
