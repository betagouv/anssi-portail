import type { ReponsesTestMaturite } from '../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import type { CodeRégion } from '../../metier/referentielRegions.js';
import type { CodeSecteur } from '../../metier/referentielSecteurs.js';
import type { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';

export type EntréePostgresRésultatTest = EntréePostgresRésultatTestMaturité;

export type EntréePostgresRésultatTestCommune = {
  id: string;
  date_realisation: Date;
};

export type EntréePostgresRésultatTestMaturité = {
  region: CodeRégion | null;
  secteur: CodeSecteur | null;
  taille_organisation: CodeTrancheEffectif | null;
  reponses: ReponsesTestMaturite | null;
  code_session_groupe: string | null;
  email_utilisateur_hache: string | null;
} & EntréePostgresRésultatTestCommune;
