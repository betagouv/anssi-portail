import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
import type { IdRubrique } from './TestMaturite.type';

export type ReponsesResultatTest = Record<IdRubrique, number>;

export type DernierResultatTest = {
  reponses: ReponsesResultatTest;
  dateRealisation: string;
  idNiveau: IdNiveau;
};
