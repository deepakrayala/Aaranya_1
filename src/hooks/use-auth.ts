import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logout, type AuthUser } from "@/lib/api/auth";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    enabled: typeof window !== "undefined",
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData<AuthUser | null>(currentUserQueryKey, null);
    },
  });
}
