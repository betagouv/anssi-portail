import {
  EntrepôtRésultatTestMaturité,
  FiltreResultatsTest,
} from '../../src/metier/mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { RésultatTestMaturité } from '../../src/metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtRésultatTestMaturitéMémoire
  extends EntrepotMemoire<RésultatTestMaturité>
  implements EntrepôtRésultatTestMaturité
{
  async pourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestMaturité[]> {
    return this.entites
      .filter((entite) => entite.utilisateur === utilisateur)
      .map((entite) => new RésultatTestMaturité({ ...entite }));
  }

  async ceuxDeSessionGroupe(code: string): Promise<RésultatTestMaturité[]> {
    return this.entites
      .filter((entite) => entite.codeSessionGroupe === code)
      .map((entite) => new RésultatTestMaturité({ ...entite }));
  }

  async metsÀjour(resultatTest: RésultatTestMaturité): Promise<void> {
    const entiteAMettreAJour = this.entites.find((entite) => entite.id === resultatTest.id);
    if (entiteAMettreAJour) {
      Object.assign(entiteAMettreAJour, resultatTest);
    }
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<RésultatTestMaturité | undefined> {
    return this.copie(this.entites.find((entite) => entite.utilisateur?.email === utilisateur.email));
  }

  tous = async (): Promise<RésultatTestMaturité[]> => {
    return this.entites.map((entite) => new RésultatTestMaturité({ ...entite }));
  };

  tousEnOmettantUtilisateur = async (): Promise<RésultatTestMaturité[]> => {
    return this.entites.map((entite) => new RésultatTestMaturité({ ...entite }));
  };

  async parId(id: string) {
    return this.copie(this.entites.find((entite) => entite.id === id));
  }

  parFiltresEnOmettantUtilisateur = async ({
    codeRegion,
    codeSecteur,
    codeTrancheEffectif,
  }: FiltreResultatsTest): Promise<RésultatTestMaturité[]> => {
    return this.entites
      .filter(
        (entite) =>
          (codeSecteur ? entite.secteur === codeSecteur : true) &&
          (codeRegion ? entite.region === codeRegion : true) &&
          (codeTrancheEffectif ? entite.tailleOrganisation === codeTrancheEffectif : true)
      )
      .map((entite) => new RésultatTestMaturité({ ...entite }));
  };

  private copie(entite: RésultatTestMaturité | undefined) {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestMaturité({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
