/// <reference types="astro/client" />

declare namespace astroHTML.JSX {
  interface LinkHTMLAttributes {
    nonce?: string;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly GOOGLE_SEARCH_CONSOLE_VERIFICATION: string;

  readonly MATOMO_ID: string;
  readonly MATOMO_URL_TAG_MANAGER: string;

  readonly PUBLIC_UI_KIT_VERSION: string;

  readonly SENTRY_ENVIRONNEMENT: string;
  readonly SENTRY_DSN: string;
}
