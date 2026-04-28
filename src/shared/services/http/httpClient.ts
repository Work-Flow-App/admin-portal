import type { ApiError } from '@/shared/types/api'

interface HttpClientConfig {
  baseUrl: string
  serviceName: string
  getAuthToken?: () => string | null
  getTenantId?: () => string | null
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

function buildUrl(base: string, path: string, params?: RequestOptions['params']): string {
  const url = new URL(path, base)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function parseError(response: Response): Promise<ApiError> {
  let details: Record<string, unknown> | undefined
  try {
    details = await response.json()
  } catch {
    // non-JSON body
  }
  return {
    status: response.status,
    code: String(details?.['code'] ?? 'UNKNOWN'),
    message: String(details?.['message'] ?? response.statusText),
    details,
  }
}

export function createHttpClient(config: HttpClientConfig) {
  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options

    const headers = new Headers(init.headers)
    headers.set('Content-Type', 'application/json')

    const token = config.getAuthToken?.()
    if (token) headers.set('Authorization', `Bearer ${token}`)

    const tenantId = config.getTenantId?.()
    if (tenantId) headers.set('X-Tenant-Id', tenantId)

    const url = buildUrl(config.baseUrl, path, params)
    const response = await fetch(url, { ...init, headers })

    if (!response.ok) {
      throw await parseError(response)
    }

    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  return {
    get: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
      request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string, options?: RequestOptions) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  }
}

export type HttpClient = ReturnType<typeof createHttpClient>
