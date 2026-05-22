// Environment configuration for Reddetect frontend
// These values are injected at build time via Vite

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const API_URL = import.meta.env.VITE_API_URL || '';

export const config = {
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
  },
  api: {
    baseUrl: API_URL,
  },
};