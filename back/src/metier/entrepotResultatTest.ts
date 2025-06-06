import { ResultatTestMaturite } from './resultatTestMaturite';

export interface EntrepotResultatTest {
  ajoute(resultatTest: ResultatTestMaturite): Promise<void>;

  parId(id: string): Promise<ResultatTestMaturite | undefined>;

  metsAjour(resultatTest: ResultatTestMaturite): Promise<void>;

  dernierPourUtilisateur(
    emailUtilisateur: string
  ): Promise<ResultatTestMaturite | undefined>;

  ceuxDeSessionGroupe(code: string): Promise<ResultatTestMaturite[]>;
}
