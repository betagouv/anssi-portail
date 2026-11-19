import { CodeRégion } from '../../referentielRegions.js';
import { CodeSecteur } from '../../referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../referentielTranchesEffectifEtablissement.js';
import { EntrepôtRésultatTest } from '../resultat-test/entrepotResultatTest.js';
import { RésultatTestMaturité } from './resultatTestMaturite.js';

export type FiltreResultatsTest = {
  codeSecteur?: CodeSecteur;
  codeRegion?: CodeRégion;
  codeTrancheEffectif?: CodeTrancheEffectif;
};

export interface EntrepôtRésultatTestMaturité extends EntrepôtRésultatTest<RésultatTestMaturité> {
  ceuxDeSessionGroupe(code: string): Promise<RésultatTestMaturité[]>;
  tousEnOmettantUtilisateur(): Promise<RésultatTestMaturité[]>;
  parFiltresEnOmettantUtilisateur(filtres: FiltreResultatsTest): Promise<RésultatTestMaturité[]>;
}
