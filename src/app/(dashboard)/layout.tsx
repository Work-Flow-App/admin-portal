import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white px-4 py-6">
        <p className="text-sm font-semibold text-gray-900">Admin Portal</p>
        <nav className="mt-6 space-y-1">
          <a href="/users" className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Users
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
