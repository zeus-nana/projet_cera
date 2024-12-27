// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import AdminService from '../../../services/adminService.js';
// import axios from 'axios';
//
// export function useDisableUserFonction(onCloseModal) {
//   const queryClient = useQueryClient();
//
//   const { mutate: disableUserFonction, isLoading: isDisabling } = useMutation({
//     mutationFn: (id) => AdminService.disableUserFonction(id),
//     onSuccess: () => {
//       toast.success('Fonction désactivée avec succès');
//       queryClient.invalidateQueries({ queryKey: ['userFonctions'] });
//
//       if (onCloseModal) onCloseModal();
//     },
//     onError: (error) => {
//       if (axios.isAxiosError(error) && error.response?.data) {
//         toast.error(`Erreur: ${error.response.data.message}`);
//       } else {
//         toast.error('Impossible de désactiver la fonction. Veuillez réessayer plus tard.');
//       }
//     },
//   });
//
//   return { isDisabling, disableUserFonction };
// }

import toast from 'react-hot-toast';
import AdminService from '../../../services/adminService.js';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUserFonctionStatus(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: updateUserFonction, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, action }) => AdminService.updateUserFonction({ id, action }),
    onSuccess: ({ data }) => {
      const statut = data?.data?.userFonction.active;

      if (statut) {
        toast.success('Fonction activée avec succès');
      } else {
        toast.success('Fonction désactivée avec succès');
      }
      queryClient.invalidateQueries({ queryKey: ['userFonctions'] });

      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error('Impossible de mettre à jour la fonction. Veuillez réessayer plus tard.');
      }
    },
  });

  return { isUpdating, updateUserFonction };
}
