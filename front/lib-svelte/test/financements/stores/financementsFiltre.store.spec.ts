import { get } from 'svelte/store';
import { beforeAll, describe, expect, it } from 'vitest';
import { financementsStore } from '@financements/stores/financements.store';
import { financementsFiltre } from '@financements/stores/financementsFiltre.store';

describe('Le store qui contient la liste des financements', () => {
  beforeAll(() => {
    financementsStore.initialise([
      {
        id: 1,
        nom: 'Cyber PME',
        financeur: 'BPI France',
        typesDeFinancement: ['Formation', 'Audits'],
        entitésÉligibles: ['PME', 'ETI'],
        périmètresGéographiques: ['France'],
        régions: ['FRANCE'],
      },
      {
        id: 2,
        nom: 'Cyber PME 2',
        financeur: 'BPI France',
        typesDeFinancement: ['Formation', "Aide à l'innovation cyber"],
        entitésÉligibles: ['PME', 'TPE', 'Associations', 'Collectivités', 'ETI', 'Entreprises'],
        périmètresGéographiques: ['France'],
        régions: ['FRANCE'],
      },
    ]);
  });

  it('retourne la liste dédupliquée des types de financements existants', () => {
    const typesFinancementAttendus = ['Audits', 'Formation', "Aide à l'innovation cyber"];

    const resultat = get(financementsFiltre).typesFinancement;

    expect(resultat).toEqual(typesFinancementAttendus);
  });

  it("retourne la liste dédupliquée des types d'organisations existants", () => {
    const typesOrganisationsAttendus = ['TPE', 'PME', 'ETI', 'Entreprises', 'Collectivités', 'Associations'];

    const resultat = get(financementsFiltre).typesOrganisation;

    expect(resultat).toEqual(typesOrganisationsAttendus);
  });
});
