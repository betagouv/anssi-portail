import type { Mesure } from './mesure';

export type ModuleRéponseApi = {
  nom: string;
  description: string;
  cibleBadge?: number;
  mesures: Mesure[];
};
