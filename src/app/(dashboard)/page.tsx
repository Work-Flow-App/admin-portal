import type { Metadata } from 'next'
import { routes } from '@/shared/constants/routes'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  redirect(routes.users.list)
}
