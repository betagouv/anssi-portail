import { Statistiques } from './statistiques.js';

export interface AdaptateurStatistiqueMiniTests {
  nombreDeMiniTestsRéalisés(): Promise<Statistiques['miniTests']>;
}
