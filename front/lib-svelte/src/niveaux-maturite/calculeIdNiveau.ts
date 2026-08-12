import type { IdNiveau } from './NiveauxMaturite.type';

export const calculeIdNiveau = (moyenne: number): IdNiveau => {
  if (moyenne < 1) return 'insuffisant';
  if (moyenne < 2) return 'emergent';
  if (moyenne < 3) return 'intermediaire';
  if (moyenne < 4) return 'confirme';
  return 'optimal';
};
