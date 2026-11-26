import {
  EntrepôtRésultatTestMaturité,
  FiltreResultatsTest,
} from '@metier/mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { RésultatTestMaturité } from '@metier/mini-tests/maturite-cyber/resultatTestMaturite.js';

import { EntrepôtRésultatTestMémoire } from './entrepotResultatTestMemoire.js';

export class EntrepôtRésultatTestMaturitéMémoire
  extends EntrepôtRésultatTestMémoire<RésultatTestMaturité>
  implements EntrepôtRésultatTestMaturité
{
  protected copie(entite: RésultatTestMaturité): RésultatTestMaturité;
  protected copie(entite: RésultatTestMaturité | undefined): RésultatTestMaturité | undefined {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestMaturité({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }

  async ceuxDeSessionGroupe(code: string): Promise<RésultatTestMaturité[]> {
    return this.copieListe(this.entites.filter((entite) => entite.codeSessionGroupe === code));
  }

  tousEnOmettantUtilisateur = async (): Promise<RésultatTestMaturité[]> => {
    return this.entites.map((entite) => new RésultatTestMaturité({ ...entite }));
  };

  parFiltresEnOmettantUtilisateur = async ({
    codeRegion,
    codeSecteur,
    codeTrancheEffectif,
  }: FiltreResultatsTest): Promise<RésultatTestMaturité[]> => {
    return this.copieListe(
      this.entites.filter(
        (entite) =>
          (codeSecteur ? entite.secteur === codeSecteur : true) &&
          (codeRegion ? entite.region === codeRegion : true) &&
          (codeTrancheEffectif ? entite.tailleOrganisation === codeTrancheEffectif : true)
      )
    );
  };
}
