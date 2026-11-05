import type { AppEnv } from '../app-env';

export const estServeur = false;

export const appEnv: AppEnv = import.meta.env.APP_ENV;
export const estEnvDémo = appEnv === 'demo';
export const nEstPasEnvProduction = appEnv !== 'production';

export const afficheBadgeCyberdépart = import.meta.env.FEATURE_FLAG_BADGE_CYBERDEPART === 'true';
