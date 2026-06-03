export type CorpsDeLaReponse = { fieldErrors: Record<string, string[]> } | { erreur: string };

export const collecteLesErreurs = (corpsDeLaReponse: CorpsDeLaReponse): string[] => {
  if ('fieldErrors' in corpsDeLaReponse) {
    return Object.values(corpsDeLaReponse.fieldErrors).flat();
  }
  return [corpsDeLaReponse.erreur];
};
