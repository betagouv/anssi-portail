import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneEvenementTestExpositionRealiseDansJournal } from '../../src/bus/consigneEvenementTestExpositionRealiseDansJournal.js';
import { TestExpositionRéalisé } from '../../src/bus/evenements/TestExpositionRealise.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne la réalisation d'un test d'exposition dans le journal", () => {
  it('consigne un évènement de TestExpositionRéalisé pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneEvenementTestExpositionRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new TestExpositionRéalisé(
        'tpe-pme-eti',
        'sante',
        ['reputation', 'geo'],
        'jeanne.dupont@user.com',
        'FR-971',
        'A',
        '11'
      )
    );

    assert.deepEqual(evenementRecu, {
      type: 'TEST_EXPOSITION_REALISE',
      donnees: {
        typeOrganisation: 'tpe-pme-eti',
        secteur: 'sante',
        facteursAggravant: ['reputation', 'geo'],
        idUtilisateur: 'jeanne.dupont@user.com-hacheHMAC',
        codeRegion: 'FR-971',
        codeSecteur: 'A',
        codeTrancheEffectif: '11',
      },
      date: new Date('2025-03-10'),
    });
  });

  it('consigne un évènement de TestExpositionRéalisé pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneEvenementTestExpositionRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new TestExpositionRéalisé('tpe-pme-eti', 'sante', ['reputation', 'geo']));

    assert.deepEqual(evenementRecu, {
      type: 'TEST_EXPOSITION_REALISE',
      donnees: {
        typeOrganisation: 'tpe-pme-eti',
        secteur: 'sante',
        facteursAggravant: ['reputation', 'geo'],
      },
      date: new Date('2025-03-10'),
    });
  });
});
