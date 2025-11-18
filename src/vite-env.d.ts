/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Convex
  readonly VITE_CONVEX_URL: string;
  readonly VITE_CONVEX_DEPLOYMENT: string;
  readonly VITE_BACKEND: string;
  
  // Supabase
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
