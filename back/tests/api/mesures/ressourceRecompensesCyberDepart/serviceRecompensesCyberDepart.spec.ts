import { describe, it } from 'node:test';
import { ServiceRécompensesCyberDépart } from '../../../../src/api/mesures/ressourceRecompensesCyberDepart/serviceRecompensesCyberDepart.js';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert';
import { fauxFournisseurDeChemin } from '../../fauxObjets.js';

describe('Le service de récompense Cyberdépart', () => {
  it('génère une bannière identique au snapshot', async () => {
    const service = new ServiceRécompensesCyberDépart(fauxFournisseurDeChemin);

    const bannière = await service.genereBanniere({ nomOrganisation: 'BetaGouv ANSSI' });
    const snapshot = await readFile(new URL('./snapshot-banniere.png', import.meta.url));

    assert.ok(bannière.equals(snapshot));
  });
});
