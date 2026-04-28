'use client'

import { useTranslations } from 'next-intl'
import type { User } from '../schemas/userSchema'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const t = useTranslations('users')

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <p className="font-medium text-gray-900">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
        {user.role}
      </span>
    </div>
  )
}
