import { appEnvDepuisValeur, type AppEnv } from '../app-env';

export const estServeur = true;

export const appEnv: AppEnv = appEnvDepuisValeur(process.env.APP_ENV);
export const estEnvDémo = appEnv === 'demo';
export const nEstPasEnvProduction = appEnv !== 'production';

export const afficheBadgeCyberdépart = process.env.FEATURE_FLAG_BADGE_CYBERDEPART === 'true';
