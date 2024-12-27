import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/adminService.js";
import toast from "react-hot-toast";
import axios from "axios";

/*
export function useDeactivateUser(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: deactivateUser, isLoading: isDeactivating } = useMutation({
    mutationFn: async (id) => {
      return await AdminService.deactivateUser(id);
    },
    onSuccess: async (data) => {
      toast.success(data.data.message);
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error(`Erreur lors de l'activation de l'utilisateur.`);
      }
    },
  });

  return {
    deactivateUser,
    isDeactivating,
  };
}
*/

export function useResetUserPassword(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: resetUserPassword, isLoading: isResetting } = useMutation({
    mutationFn: async (id) => {
      return await AdminService.resetUserPassword(id);
    },
    onSuccess: async (data) => {
      toast.success(data.data.message);
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      if (onCloseModal) onCloseModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
        if (onCloseModal) onCloseModal();
      } else {
        toast.error(`Erreur lors de l'activation de l'utilisateur.`);
      }
    },
  });

  return {
    resetUserPassword,
    isResetting,
  };
}
