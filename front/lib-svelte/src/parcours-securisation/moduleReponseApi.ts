import type { Mesure } from './mesures/mesure';

export type ModuleRéponseApi = {
  nom: string;
  description: string;
  cibleBadge?: number;
  mesures: Mesure[];
};
