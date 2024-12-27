import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import AuthService from "../../services/authService.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogin(onResetPassword) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: signIn, isLoading } = useMutation({
    mutationFn: async ({ login, password }) => {
      return AuthService.login(login, password);
    },
    onSuccess: async (data) => {
      if (data.user.must_reset_password) {
        toast.success("Vous devez changer votre mot de passe");
        onResetPassword(data.user.id);
      } else {
        queryClient.setQueryData(["user"], data.user);
        navigate("/home", { replace: true });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`${error.response.data.message}`);
      } else {
        toast.error(`Erreur lors de la connexion.`);
      }
    },
  });
  return { signIn, isLoading };
}
