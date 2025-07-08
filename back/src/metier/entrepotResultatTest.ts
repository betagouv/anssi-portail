import { ResultatTestMaturite } from './resultatTestMaturite';
import { Utilisateur } from './utilisateur';

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
}
