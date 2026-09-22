/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FEATURE_FLAG_PARCOURS_SECURISATION: string;
  readonly FEATURE_FLAG_BADGE_CYBERDEPART: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
