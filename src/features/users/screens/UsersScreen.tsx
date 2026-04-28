'use client'

import { useTranslations } from 'next-intl'
import { useUsers } from '../hooks/useUsers'
import { UserCard } from '../components/UserCard'

export function UsersScreen() {
  const t = useTranslations('users')
  const { data, isLoading, isError } = useUsers()

  if (isLoading) return <p className="text-gray-500">{t('loading')}</p>
  if (isError) return <p className="text-red-600">{t('error')}</p>
  if (!data?.data.length) return <p className="text-gray-500">{t('empty')}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
      <div className="space-y-2">
        {data.data.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}
