import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminService from "../../services/adminService";
import toast from "react-hot-toast";
import axios from "axios";

export function useCreateUser(onCloseModal) {
  const queryClient = useQueryClient();

  const { mutate: creatingUser, isLoading: isCreating } = useMutation({
    mutationFn: async (newUser) => {
      return await AdminService.createUser(newUser);
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
        toast.error(`Erreur lors de la création de l'utilisateur.`);
      }
    },
  });

  return {
    creatingUser,
    isCreating,
  };
}
