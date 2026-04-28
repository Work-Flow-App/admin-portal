import { createHttpClient } from '../http/httpClient'
import { env } from '@/shared/config/env'

export const coreApiClient = createHttpClient({
  baseUrl: env.coreApiUrl,
  serviceName: 'core-api',
})
