import type { ReponsesTestMaturite } from '../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import type { CodeRégion } from '../../metier/referentielRegions.js';
import type { CodeSecteur } from '../../metier/referentielSecteurs.js';
import type { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';

export type EntréePostgresRésultatTest =
  | EntréePostgresRésultatTestMaturité
  | EntréePostgresRésultatTestVraiFaux
  | EntréePostgresRésultatTestHameçonnage
  | EntréePostgresRésultatTestExposition
  | EntréePostgresRésultatTestRéflexesCyber;

export type EntréePostgresRésultatTestCommune = {
  id: string;
  date_realisation: Date;
  email_utilisateur_hache: string | null;
};

export type EntréePostgresRésultatTestMaturité = {
  type_test: 'maturité cyber';
  region: CodeRégion | null;
  secteur: CodeSecteur | null;
  taille_organisation: CodeTrancheEffectif | null;
  reponses: ReponsesTestMaturite | null;
  code_session_groupe: string | null;
} & EntréePostgresRésultatTestCommune;

export type EntréePostgresRésultatTestVraiFaux = {
  type_test: 'vrai-faux';
  score: string;
} & EntréePostgresRésultatTestCommune;

export type EntréePostgresRésultatTestHameçonnage = {
  type_test: 'hameçonnage';
  score: string;
} & EntréePostgresRésultatTestCommune;

export type EntréePostgresRésultatTestExposition = {
  type_test: 'exposition';
} & EntréePostgresRésultatTestCommune;

export type EntréePostgresRésultatTestRéflexesCyber = {
  type_test: 'réflexes cyber';
  score: string;
} & EntréePostgresRésultatTestCommune;

export type TypeTest = EntréePostgresRésultatTest['type_test'];

export type EntréePostgresDuType<Type extends TypeTest> = Extract<EntréePostgresRésultatTest, { type_test: Type }>;

export const estUneEntréeDuType = <Type extends TypeTest>(
  entrée: EntréePostgresRésultatTest,
  typeTest: Type
): entrée is EntréePostgresDuType<Type> => entrée.type_test === typeTest;
