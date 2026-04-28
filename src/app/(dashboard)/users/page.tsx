import type { Metadata } from 'next'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { userKeys } from '@/shared/queryKeys/userKeys'
import { fetchUsers } from '@/features/users/services/usersService'
import { UsersScreen } from '@/features/users/screens/UsersScreen'

export const metadata: Metadata = { title: 'Users — Admin Portal' }

export default async function UsersPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: userKeys.list({}),
    queryFn: () => fetchUsers({}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersScreen />
    </HydrationBoundary>
  )
}
