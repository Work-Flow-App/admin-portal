import { coreApiClient } from '@/shared/services/clients/coreApiClient'
import type { PaginatedResponse } from '@/shared/types/api'
import type { User, InviteUserInput } from '../schemas/userSchema'
import type { UserListFilters } from '@/shared/queryKeys/userKeys'

export async function fetchUsers(filters: UserListFilters): Promise<PaginatedResponse<User>> {
  return coreApiClient.get<PaginatedResponse<User>>('/users', {
    params: {
      search: filters.search,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  })
}

export async function fetchUser(id: string): Promise<User> {
  return coreApiClient.get<User>(`/users/${id}`)
}

export async function inviteUser(input: InviteUserInput): Promise<User> {
  return coreApiClient.post<User>('/users/invite', input)
}
