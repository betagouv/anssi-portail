import { describe, expect, it } from 'vitest';

import { consigneCompteCreeDansJournal } from '@bus/consigneCompteCreeDansJournal.js';
import { CompteCree } from '@bus/evenements/compteCree.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';

import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne la création d'un compte utilisateur dans le journal", () => {
  it("consigne un évènement avec les données de l'utilisateur", async () => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donnéesÉvÈnement: unknown) => {
        évènementReçu = donnéesÉvÈnement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new CompteCree({
        email: 'u1@mail.com',
        nom: 'dupont',
        prenom: 'jean',
        infoLettre: false,
        pixelDeSuiviAccepté: true,
      })
    );

    expect(évènementReçu).toBeDefined();
    expect(évènementReçu!.type).toBe('NOUVEL_UTILISATEUR_INSCRIT');
    expect(évènementReçu!.donnees?.idUtilisateur).toBe('u1@mail.com-hacheHMAC');
    expect(évènementReçu!.date).toEqual(Temporal.Instant.from('2025-03-10T00:00:00Z'));
  });

  it("consigne un évènement avec la provenance de l'utilisateur", async () => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donnéesÉvÈnement: unknown) => {
        évènementReçu = donnéesÉvÈnement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new CompteCree({
        email: 'u1@mail.com',
        nom: 'dupont',
        prenom: 'jean',
        infoLettre: false,
        pixelDeSuiviAccepté: true,
        suivi: {
          campagne: 'campagne_aout_2026',
          source: '/parcours-securisation',
          parcoursDestination: '/parcours-complet',
        },
      })
    );

    expect(évènementReçu!.donnees?.suivi.campagne).toBe('campagne_aout_2026');
    expect(évènementReçu!.donnees?.suivi.source).toBe('/parcours-securisation');
    expect(évènementReçu!.donnees?.suivi.parcoursDestination).toBe('/parcours-complet');
  });
});
