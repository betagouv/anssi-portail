import { EntrepotReactionMiniTest } from '../../src/metier/mini-tests/entrepotReactionMiniTest.js';
import { RéactionMiniTest } from '../../src/metier/mini-tests/reactionMiniTest.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotReactionMiniTestMemoire
  extends EntrepotMemoire<RéactionMiniTest>
  implements EntrepotReactionMiniTest
{
  async metsÀJour(réaction: RéactionMiniTest): Promise<void> {
    const entitéAMettreAJour = this.entites.find(
      (entite) => entite.id === réaction.id && entite.typeRéaction === réaction.typeRéaction
    );
    if (entitéAMettreAJour) {
      Object.assign(entitéAMettreAJour, réaction);
    }
  }

  tous = async (): Promise<RéactionMiniTest[]> => {
    return this.entites.map((entité) => new RéactionMiniTest(entité.id, entité.typeRéaction, entité.compteur));
  };
}
