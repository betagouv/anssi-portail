import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../../src/metier/resultatTestMaturite';

export class EntrepotResultatTestMemoire implements EntrepotResultatTest {
  entites: ResultatTestMaturite[] = [];

  async ajoute(resultatTest: ResultatTestMaturite): Promise<void> {
    this.entites.push(resultatTest);
  }

  async dernierPourUtilisateur(
    email: string
  ): Promise<ResultatTestMaturite | undefined> {
    return this.entites.find((entite) => entite.emailUtilisateur === email);
  }

  tous = async (): Promise<ResultatTestMaturite[]> => {
    return [...this.entites];
  };
}
