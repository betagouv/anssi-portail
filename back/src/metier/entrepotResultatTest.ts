import { CodeRegion } from './referentielRegions';
import { CodeSecteur } from './referentielSecteurs';
import { CodeTrancheEffectif } from './referentielTranchesEffectifEtablissement';
import { ResultatTestMaturite } from './resultatTestMaturite';
import { Utilisateur } from './utilisateur';

export type FiltreResultatsTest = {
  codeSecteur?: CodeSecteur;
  codeRegion?: CodeRegion;
  codeTrancheEffectif?: CodeTrancheEffectif;
};

export interface EntrepotResultatTest {
  ajoute(resultatTest: ResultatTestMaturite): Promise<void>;

  parId(id: string): Promise<ResultatTestMaturite | undefined>;

  metsAjour(resultatTest: ResultatTestMaturite): Promise<void>;

  dernierPourUtilisateur(
    utilisateur: Utilisateur
  ): Promise<ResultatTestMaturite | undefined>;

  ceuxDeSessionGroupe(code: string): Promise<ResultatTestMaturite[]>;

  taille(): Promise<number>;
  tousEnOmettantUtilisateur(): Promise<ResultatTestMaturite[]>;

  pourUtilisateur(utilisateur: Utilisateur): Promise<ResultatTestMaturite[]>;

  parFiltresEnOmettantUtilisateur(
    filtres: FiltreResultatsTest
  ): Promise<ResultatTestMaturite[]>;
}
