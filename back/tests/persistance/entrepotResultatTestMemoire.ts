import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../../src/metier/resultatTestMaturite';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotResultatTestMemoire extends EntrepotMemoire<ResultatTestMaturite> implements EntrepotResultatTest {

  async metsAjour(resultatTest: ResultatTestMaturite): Promise<void> {
    const entiteAMettreAJour = this.entites.find(
      (entite) => entite.id === resultatTest.id
    );
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(
    email: string
  ): Promise<ResultatTestMaturite | undefined> {
    return this.copie(
      this.entites.find((entite) => entite.emailUtilisateur === email)
    );
  }

  tous = async (): Promise<ResultatTestMaturite[]> => {
    return this.entites.map(
      (entite) => new ResultatTestMaturite({ ...entite })
    );
  };

  async parId(id: string) {
    return this.copie(this.entites.find((entite) => entite.id === id));
  }

  private copie(entite: ResultatTestMaturite | undefined) {
    return entite ? new ResultatTestMaturite({ ...entite }) : undefined;
  }
}
