/// <reference types="vite/client" />

import type { AppEnv } from '../app-env';

interface ImportMetaEnv {
  readonly APP_ENV: AppEnv;
  readonly FEATURE_FLAG_BADGE_CYBERDEPART: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
