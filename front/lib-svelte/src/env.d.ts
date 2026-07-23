/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FEATURE_FLAG_NOUVELLE_DA: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
