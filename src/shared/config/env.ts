function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

export const env = {
  coreApiUrl: requireEnv('NEXT_PUBLIC_CORE_API_URL', 'http://localhost:3000/api'),
}
