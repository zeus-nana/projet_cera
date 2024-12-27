import { useQuery } from "@tanstack/react-query";
import AuthService from "../../services/authService.js";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: AuthService.getCurrentUser,
    staleTime: Infinity, // Consider the data fresh indefinitely
    cacheTime: Infinity, // Keep the data in cache indefinitely
    retry: false,
  });

  return {
    isLoading,
    isAuthenticated: user?.authenticated,
    user: user ?? null,
  };
}
