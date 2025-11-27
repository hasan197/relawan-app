/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_PROVIDER: string
  readonly VITE_BACKEND: string
  readonly VITE_CONVEX_URL: string
  readonly VITE_CONVEX_DEPLOYMENT: string
  readonly NEXT_PUBLIC_CONVEX_URL: string
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
