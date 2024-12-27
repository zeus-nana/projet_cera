import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import AuthService from "../../services/authService.js";
import toast from "react-hot-toast";
// import { useUser } from "./useUser.js";

export function useChangePassword(onCloseModal) {
  const navigate = useNavigate();
  // const { user } = useUser();

  const { mutate: changePass, isLoading } = useMutation({
    mutationFn: async ({ userId, currentPassword, newPassword }) => {
      return AuthService.changePassword(userId, currentPassword, newPassword);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Mot de passe changé avec succès");
      if (onCloseModal) {
        onCloseModal();
      } else {
        navigate("/home", { replace: true });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(
          error.response.data.message ||
            "Erreur lors du changement de mot de passe",
        );
      } else {
        toast.error(
          "Erreur lors du changement de mot de passe. Veuillez réessayer plus tard.",
        );
      }
    },
  });

  return { changePass, isLoading };
}
