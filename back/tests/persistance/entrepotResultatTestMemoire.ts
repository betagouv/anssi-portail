import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../../src/metier/resultatTestMaturite';
import { EntrepotMemoire } from './entrepotMemoire';
import { Utilisateur } from '../../src/metier/utilisateur';

export class EntrepotResultatTestMemoire
  extends EntrepotMemoire<ResultatTestMaturite>
  implements EntrepotResultatTest
{
  async ceuxDeSessionGroupe(code: string): Promise<ResultatTestMaturite[]> {
    return this.entites
      .filter((entite) => entite.codeSessionGroupe === code)
      .map((entite) => new ResultatTestMaturite({ ...entite }));
  }

  async metsAjour(resultatTest: ResultatTestMaturite): Promise<void> {
    const entiteAMettreAJour = this.entites.find(
      (entite) => entite.id === resultatTest.id
    );
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(
    utilisateur: Utilisateur
  ): Promise<ResultatTestMaturite | undefined> {
    return this.copie(
      this.entites.find((entite) => entite.utilisateur?.email === utilisateur.email)
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
