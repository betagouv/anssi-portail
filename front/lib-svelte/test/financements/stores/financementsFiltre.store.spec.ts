import { beforeAll, describe, expect, it } from 'vitest';
import { financementsStore } from '../../../src/financements/stores/financements.store';
import { financementsFiltre } from '../../../src/financements/stores/financementsFiltre.store';
import { get } from 'svelte/store';

describe('Le store qui contient la liste des financements', () => {
  beforeAll(() => {
    financementsStore.initialise([
      {
        id: 1,
        nom: 'Cyber PME',
        financeur: 'BPI France',
        typesDeFinancement: ['Formation', 'Audits'],
        entitesElligibles: ['PME', 'ETI'],
        perimetresGeographiques: ['France'],
        regions: ['FRANCE'],
      },
      {
        id: 2,
        nom: 'Cyber PME 2',
        financeur: 'BPI France',
        typesDeFinancement: ['Formation', "Aide à l'innovation"],
        entitesElligibles: [
          'PME',
          'TPE',
          'Associations',
          'Collectivités',
          'ETI',
          'Entreprises',
        ],
        perimetresGeographiques: ['France'],
        regions: ['FRANCE'],
      },
    ]);
  });

  it('retourne la liste dédupliquée des types de financements existants', () => {
    const typesFinancementAttendus = [
      "Aide à l'innovation",
      'Audits',
      'Formation',
    ];

    const resultat = get(financementsFiltre).typesFinancement;

    expect(resultat).toEqual(typesFinancementAttendus);
  });

  it("retourne la liste dédupliquée des types d'organisations existants", () => {
    const typesOrganisationsAttendus = [
      'TPE',
      'PME',
      'ETI',
      'Entreprises',
      'Collectivités',
      'Associations',
    ];

    const resultat = get(financementsFiltre).typesOrganisation;

    expect(resultat).toEqual(typesOrganisationsAttendus);
  });
});
