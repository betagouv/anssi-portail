import { CodeRégion } from '../../referentielRegions.js';
import { CodeSecteur } from '../../referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from '../../utilisateur.js';
import { RésultatTestMaturité } from './resultatTestMaturite.js';

export type FiltreResultatsTest = {
  codeSecteur?: CodeSecteur;
  codeRegion?: CodeRégion;
  codeTrancheEffectif?: CodeTrancheEffectif;
};

export interface EntrepôtRésultatTestMaturité {
  ajoute(resultatTest: RésultatTestMaturité): Promise<void>;

  parId(id: string): Promise<RésultatTestMaturité | undefined>;

  metsÀjour(resultatTest: RésultatTestMaturité): Promise<void>;

  dernierPourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestMaturité | undefined>;

  ceuxDeSessionGroupe(code: string): Promise<RésultatTestMaturité[]>;

  taille(): Promise<number>;
  tousEnOmettantUtilisateur(): Promise<RésultatTestMaturité[]>;

  pourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestMaturité[]>;

  parFiltresEnOmettantUtilisateur(filtres: FiltreResultatsTest): Promise<RésultatTestMaturité[]>;
}
