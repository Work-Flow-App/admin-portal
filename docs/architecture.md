# Architecture

## Layers

```
src/app/**/page.tsx          Route — thin: metadata, prefetch, HydrationBoundary
src/features/<name>/screens  Screen — "use client", composes feature components
src/features/<name>/hooks    TanStack Query hooks wrapping service calls
src/features/<name>/services Pure async functions calling the API client
src/features/<name>/schemas  Zod types for API responses and forms
src/shared/queryKeys         Query key factories shared by server prefetch + client hooks
src/shared/services/clients  One HTTP client instance per backend
src/shared/services/http     Base HTTP client factory (auth, headers, error normalization)
src/shared/constants/routes  All route paths and builders — single source of truth
src/shared/stores            Zustand stores (client/global state only)
src/shared/i18n              next-intl config + message files
```

## Data flow

```
Route (Server Component)
  └─ prefetchQuery(userKeys.list({}), fetchUsers)   ← same key + fn as client hook
  └─ HydrationBoundary(dehydrate(queryClient))
       └─ Screen ("use client")
            └─ useUsers() → TanStack Query (cache hit from prefetch)
                 └─ usersService.fetchUsers()
                      └─ coreApiClient.get('/users')
                           └─ httpClient (auth header, error normalize)
```

## How to add a feature

Use `/add-feature <name>` command — Claude will scaffold everything.

Manual steps:

1. `src/features/<name>/schemas/<name>Schema.ts` — Zod types
2. `src/features/<name>/services/<name>Service.ts` — async functions, import API client
3. `src/shared/queryKeys/<name>Keys.ts` — key factory
4. `src/features/<name>/hooks/use<Name>.ts` — `useQuery`/`useMutation` wrapping service
5. `src/features/<name>/screens/<Name>Screen.tsx` — `"use client"`, compose UI
6. `src/features/<name>/components/` — feature-scoped UI components
7. `src/app/(dashboard)/<name>/page.tsx` — prefetch + `HydrationBoundary` + screen
8. Add route to `src/shared/constants/routes.ts`
9. Add i18n keys to `src/shared/i18n/messages/en.json`

## How to add a new backend / OpenAPI client

Use `/add-backend <name>` command — Claude will scaffold everything.

Manual steps:

### 1. Add env var
`.env.local`:
```
NEXT_PUBLIC_<NAME>_API_URL=https://api.example.com
```

### 2. Register in env config
`src/shared/config/env.ts`:
```ts
<name>ApiUrl: requireEnv('NEXT_PUBLIC_<NAME>_API_URL'),
```

### 3. Create client
`src/shared/services/clients/<name>Client.ts`:
```ts
import { createHttpClient } from '../http/httpClient'
import { env } from '@/shared/config/env'

export const <name>Client = createHttpClient({
  baseUrl: env.<name>ApiUrl,
  serviceName: '<name>',
})
```

### 4. (Optional) Generate OpenAPI types
Add OpenAPI spec to `openapi/<name>.yaml`, then:
```bash
npm run generate:api
# adjust the script in package.json for each backend
```

Types land in `src/shared/services/clients/generated/`. Import them only inside service files.

### 5. Use in services
```ts
import { <name>Client } from '@/shared/services/clients/<name>Client'

export async function fetchSomething(): Promise<Something> {
  return <name>Client.get<Something>('/something')
}
```

## Error handling

All HTTP errors normalize to `ApiError` (`src/shared/types/api.ts`):
```ts
{ status: number, code: string, message: string, details?: Record<string, unknown> }
```

`httpClient` throws `ApiError` on non-2xx. Catch in hooks with TanStack Query's `error` state. No try/catch needed in service files unless adding domain-specific handling.

## State rules

| Data type | Where |
|---|---|
| Server data (API responses) | TanStack Query |
| Client/UI state (current user, tenant) | Zustand |
| Form state | react-hook-form |
| URL state (filters, pagination) | `useSearchParams` |

Never put server data in Zustand.
