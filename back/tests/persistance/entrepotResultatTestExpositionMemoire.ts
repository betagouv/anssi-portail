import { EntrepôtRésultatTestExposition } from '../../src/metier/mini-tests/exposition/entrepotResultatTestExposition.js';
import { RésultatTestExposition } from '../../src/metier/mini-tests/exposition/resultatTestExposition.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtRésultatTestExpositionMémoire
  extends EntrepotMemoire<RésultatTestExposition>
  implements EntrepôtRésultatTestExposition
{
  async pourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestExposition[]> {
    return this.entites
      .filter((entite) => entite.utilisateur === utilisateur)
      .map((entite) => new RésultatTestExposition({ ...entite }));
  }

  async metsÀjour(resultatTest: RésultatTestExposition): Promise<void> {
    const entiteAMettreAJour = this.entites.find((entite) => entite.id === resultatTest.id);
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestExposition | undefined> {
    return this.copie(this.entites.find((entite) => entite.utilisateur?.email === utilisateur.email));
  }

  tous = async (): Promise<RésultatTestExposition[]> => {
    return this.entites.map((entite) => new RésultatTestExposition({ ...entite }));
  };

  async parId(id: string) {
    return this.copie(this.entites.find((entite) => entite.id === id));
  }

  private copie(entite: RésultatTestExposition | undefined) {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestExposition({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
