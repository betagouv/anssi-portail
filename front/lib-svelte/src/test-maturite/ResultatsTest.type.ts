import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
import type { IdRubrique } from './TestMaturite.type';

export type ReponsesResultatTest = Record<IdRubrique, number>;

export type CodeLibelle = {
  code: string;
  libelle: string;
};

export type InfosOrganisation = {
  secteur: CodeLibelle;
  region: CodeLibelle;
  trancheEffectif: CodeLibelle;
};

export type DernierResultatTest = {
  reponses: ReponsesResultatTest;
  dateRealisation: string;
  idNiveau: IdNiveau;
  organisation: InfosOrganisation;
};
