export type Erreurs = { fieldErrors: Record<string, string[]> };

export const collecteLesErreurs = (erreur: Erreurs): string[] => {
  return Object.values(erreur.fieldErrors).flat();
};
