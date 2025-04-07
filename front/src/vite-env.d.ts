/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACK_BASE_URL: string
  readonly VITE_FRONT_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
