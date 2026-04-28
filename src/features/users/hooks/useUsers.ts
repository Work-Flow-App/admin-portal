import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userKeys, type UserListFilters } from '@/shared/queryKeys/userKeys'
import { fetchUsers, fetchUser, inviteUser } from '../services/usersService'
import type { InviteUserInput } from '../schemas/userSchema'

export function useUsers(filters: UserListFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: InviteUserInput) => inviteUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
