import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { ChargeurContacts } from '../../../../src/infra/enrichissement/chargementProprietes/chargeurContacts.js';
import { RésolveurDePage } from '../../../../src/infra/enrichissement/resolveurDePage.js';
import { EntrepotContactStatique } from '../../../../src/infra/entrepotContactStatique.js';
import { EntrepôtArticleMémoire } from '../../../persistance/entrepotArticleMemoire.js';
import { EntrepotFinancementMemoire } from '../../../persistance/entrepotFinancementMemoire.js';
import { EntrepotGuideMemoire } from '../../../persistance/entrepotGuideMemoire.js';

describe('Le chargeur de props des contacts', () => {
  const entrepotContact = new EntrepotContactStatique();
  const chargeur = new ChargeurContacts(
    new RésolveurDePage(new EntrepotGuideMemoire(), new EntrepotFinancementMemoire(), new EntrepôtArticleMémoire()),
    entrepotContact
  );
  const dom = new JSDOM('');

  it('fournit tous les contacts sur /contacts', async () => {
    const props = await chargeur.charge(dom, '/contacts');

    expect(props).toStrictEqual({
      contactsInitiaux: {
        regionaux: await entrepotContact.regionaux(),
        sectoriels: await entrepotContact.sectoriels(),
        nationaux: await entrepotContact.nationaux(),
      },
    });
  });

  it('fournit aussi la région demandée sur /contacts/fr-bre', async () => {
    const props = await chargeur.charge(dom, '/contacts/fr-bre');

    expect(props).toMatchObject({ regionInitiale: 'FR-BRE' });
  });

  it('ne fournit rien pour une autre page', async () => {
    expect(await chargeur.charge(dom, '/financements')).toBeUndefined();
  });
});
