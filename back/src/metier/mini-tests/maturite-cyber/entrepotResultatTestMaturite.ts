import { CodeRégion } from '../../referentielRegions.js';
import { CodeSecteur } from '../../referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../referentielTranchesEffectifEtablissement.js';
import { Utilisateur } from '../../utilisateur.js';
import { ResultatTestMaturite } from './resultatTestMaturite.js';

export type FiltreResultatsTest = {
  codeSecteur?: CodeSecteur;
  codeRegion?: CodeRégion;
  codeTrancheEffectif?: CodeTrancheEffectif;
};

export interface EntrepôtRésultatTestMaturité {
  ajoute(resultatTest: ResultatTestMaturite): Promise<void>;

  parId(id: string): Promise<ResultatTestMaturite | undefined>;

  metsAjour(resultatTest: ResultatTestMaturite): Promise<void>;

  dernierPourUtilisateur(utilisateur: Utilisateur): Promise<ResultatTestMaturite | undefined>;

  ceuxDeSessionGroupe(code: string): Promise<ResultatTestMaturite[]>;

  taille(): Promise<number>;
  tousEnOmettantUtilisateur(): Promise<ResultatTestMaturite[]>;

  pourUtilisateur(utilisateur: Utilisateur): Promise<ResultatTestMaturite[]>;

  parFiltresEnOmettantUtilisateur(filtres: FiltreResultatsTest): Promise<ResultatTestMaturite[]>;
}
