/// <reference types="vite/client" />

import type { AppEnv } from './app-env';

declare global {
  interface ImportMetaEnv {
    readonly APP_ENV: AppEnv;
    readonly FEATURE_FLAG_BADGE_CYBERDEPART: string;
    readonly FEATURE_FLAG_ESPACE_CONNECTE: string;
  }
}
