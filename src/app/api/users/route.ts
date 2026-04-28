import { NextResponse } from 'next/server'
import type { User } from '@/features/users/schemas/userSchema'
import type { PaginatedResponse } from '@/shared/types/api'

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'member',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'viewer',
    createdAt: '2024-03-05T09:15:00Z',
  },
]

export async function GET(): Promise<NextResponse<PaginatedResponse<User>>> {
  return NextResponse.json({
    data: MOCK_USERS,
    total: MOCK_USERS.length,
    page: 1,
    pageSize: 20,
  })
}

export async function POST(request: Request): Promise<NextResponse<User>> {
  const body = await request.json() as { email: string; role: User['role'] }
  const newUser: User = {
    id: String(Date.now()),
    name: body.email.split('@')[0] ?? 'New User',
    email: body.email,
    role: body.role,
    createdAt: new Date().toISOString(),
  }
  return NextResponse.json(newUser, { status: 201 })
}
