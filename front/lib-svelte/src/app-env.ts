export const appEnv = ['local', 'demo', 'production'] as const;

export type AppEnv = (typeof appEnv)[number];

export const estAppEnv = (valeur: string): valeur is AppEnv => {
  return (appEnv as readonly string[]).includes(valeur);
};

export const appEnvDepuisValeur = (valeur: string | undefined): AppEnv => {
  if (valeur !== undefined && estAppEnv(valeur)) {
    return valeur;
  }
  return 'production';
};
