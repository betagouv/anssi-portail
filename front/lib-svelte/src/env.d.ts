/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FEATURE_FLAG_PARCOURS_SECURISATION: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
