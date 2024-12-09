/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}