import { EntrepôtRésultatTestVraiFaux } from '../../src/metier/mini-tests/vrai-faux/entrepotResultatTestVraiFaux.js';
import { RésultatTestVraiFaux } from '../../src/metier/mini-tests/vrai-faux/resultatTestVraiFaux.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtRésultatTestVraiFauxMémoire
  extends EntrepotMemoire<RésultatTestVraiFaux>
  implements EntrepôtRésultatTestVraiFaux
{
  async pourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestVraiFaux[]> {
    return this.entites
      .filter((entite) => entite.utilisateur === utilisateur)
      .map((entite) => new RésultatTestVraiFaux({ ...entite }));
  }

  async metsÀjour(resultatTest: RésultatTestVraiFaux): Promise<void> {
    const entiteAMettreAJour = this.entites.find((entite) => entite.id === resultatTest.id);
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestVraiFaux | undefined> {
    return this.copie(this.entites.find((entite) => entite.utilisateur?.email === utilisateur.email));
  }

  tous = async (): Promise<RésultatTestVraiFaux[]> => {
    return this.entites.map((entite) => new RésultatTestVraiFaux({ ...entite }));
  };

  async parId(id: string) {
    return this.copie(this.entites.find((entite) => entite.id === id));
  }

  private copie(entite: RésultatTestVraiFaux | undefined) {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestVraiFaux({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
