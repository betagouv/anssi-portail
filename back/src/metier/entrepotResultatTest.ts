import { CodeRegion } from './referentielRegions.js';
import { CodeSecteur } from './referentielSecteurs.js';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement.js';
import { ResultatTestMaturite } from './resultatTestMaturite.js';
import { Utilisateur } from './utilisateur.js';

export type FiltreResultatsTest = {
  codeSecteur?: CodeSecteur;
  codeRegion?: CodeRegion;
  codeTrancheEffectif?: CodeTrancheEffectif;
};

export interface EntrepotResultatTest {
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
