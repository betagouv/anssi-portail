import { EntrepôtRésultatTest } from '@metier/mini-tests/resultat-test/entrepotResultatTest.js';
import { RésultatTest } from '@metier/mini-tests/resultat-test/resultatTest.js';
import { Utilisateur } from '@metier/utilisateur.js';

import { EntrepotMemoire } from './entrepotMemoire.js';

export abstract class EntrepôtRésultatTestMémoire<T extends RésultatTest>
  extends EntrepotMemoire<T>
  implements EntrepôtRésultatTest<T>
{
  async pourUtilisateur(utilisateur: Utilisateur): Promise<T[]> {
    return this.copieListe(this.entites.filter((entite) => entite.utilisateur === utilisateur));
  }

  async metsÀjour(resultatTest: T): Promise<void> {
    const entiteAMettreAJour = this.entites.find((entite) => entite.id === resultatTest.id);
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<T | undefined> {
    return this.copie(this.entites.find((entite) => entite.utilisateur?.email === utilisateur.email));
  }

  tous = async (): Promise<T[]> => this.copieListe(this.entites);

  async parId(id: string) {
    return this.copie(this.entites.find((entite) => entite.id === id));
  }

  copieListe(entites: T[]): T[];
  copieListe(entites: (T | undefined)[]): (T | undefined)[] {
    return entites.map((entite) => this.copie(entite));
  }

  protected abstract copie(entite: T): T;
  protected abstract copie(entite: T | undefined): T | undefined;
}
