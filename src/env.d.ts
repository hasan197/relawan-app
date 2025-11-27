/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_PROVIDER: string
  readonly VITE_CONVEX_URL: string
  readonly VITE_CONVEX_DEPLOYMENT: string
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
