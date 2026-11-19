import { EntrepôtRésultatTestHameçonnage } from '../../src/metier/mini-tests/hameconnage/entrepotResultatTestHameconnage.js';
import { RésultatTestHameçonnage } from '../../src/metier/mini-tests/hameconnage/resultatTestHameconnage.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtRésultatTestHameçonnageMémoire
  extends EntrepotMemoire<RésultatTestHameçonnage>
  implements EntrepôtRésultatTestHameçonnage
{
  async pourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestHameçonnage[]> {
    return this.entites
      .filter((entite) => entite.utilisateur === utilisateur)
      .map((entite) => new RésultatTestHameçonnage({ ...entite }));
  }

  async metsÀjour(resultatTest: RésultatTestHameçonnage): Promise<void> {
    const entiteAMettreAJour = this.entites.find((entite) => entite.id === resultatTest.id);
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestHameçonnage | undefined> {
    return this.copie(this.entites.find((entite) => entite.utilisateur?.email === utilisateur.email));
  }

  tous = async (): Promise<RésultatTestHameçonnage[]> => {
    return this.entites.map((entite) => new RésultatTestHameçonnage({ ...entite }));
  };

  async parId(id: string) {
    return this.copie(this.entites.find((entite) => entite.id === id));
  }

  private copie(entite: RésultatTestHameçonnage | undefined) {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestHameçonnage({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
