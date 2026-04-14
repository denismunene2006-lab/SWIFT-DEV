import { createClient } from '@supabase/supabase-js'

const backendUrl = import.meta.env.VITE_SUPABASE_URL
const backendAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasBackendConfig = Boolean(backendUrl && backendAnonKey)

if (!hasBackendConfig) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Backend features are disabled until .env is updated.')
}

export const backendClient = hasBackendConfig
  ? createClient(backendUrl, backendAnonKey)
  : null