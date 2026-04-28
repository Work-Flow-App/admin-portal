export const routes = {
  dashboard: '/',
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    create: '/users/create',
    edit: (id: string) => `/users/${id}/edit`,
  },
} as const
