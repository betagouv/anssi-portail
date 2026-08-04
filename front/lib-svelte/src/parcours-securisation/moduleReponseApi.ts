import type { Mesure } from './mesure';

export type ModuleRéponseApi = {
  nom: string;
  cibleBadge?: number;
  mesures: Mesure[];
};
