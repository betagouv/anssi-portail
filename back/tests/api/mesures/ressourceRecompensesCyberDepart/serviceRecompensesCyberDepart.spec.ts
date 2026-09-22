import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { ServiceRécompensesCyberDépart } from '../../../../src/api/mesures/ressourceRecompensesCyberDepart/serviceRecompensesCyberDepart.js';
import { fauxFournisseurDeChemin } from '../../fauxObjets.js';

describe('Le service de récompense Cyberdépart', () => {
  it('génère une bannière identique au snapshot', async () => {
    const service = new ServiceRécompensesCyberDépart(fauxFournisseurDeChemin);

    const bannière = await service.genereBanniere({ nomOrganisation: 'BetaGouv ANSSI' });
    const snapshot = await readFile(new URL('./snapshot-banniere.png', import.meta.url));

    expect(bannière.equals(snapshot)).toBeTruthy();
  });
});
