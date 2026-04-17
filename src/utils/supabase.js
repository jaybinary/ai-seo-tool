import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper: get current logged-in user from Supabase session
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper: normalize a URL for consistent comparison
// https://WWW.Example.com/Blog/Post/ → example.com/blog/post
export function normalizeUrl(url) {
  try {
    const parsed = new URL(url)
    let normalized = parsed.hostname.replace(/^www\./, '') + parsed.pathname
    normalized = normalized.toLowerCase().replace(/\/+$/, '')
    return normalized
  } catch {
    return url.toLowerCase().replace(/\/+$/, '')
  }
}

// Helper: extract domain from URL
// https://example.com/page → example.com
export function extractDomain(url) {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
