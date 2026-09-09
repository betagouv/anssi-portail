import { describe, it } from 'node:test';
import { consigneEvenementTestExpositionRealiseDansJournal } from '../../src/bus/consigneEvenementTestExpositionRealiseDansJournal.js';
import { TestExpositionRéalisé } from '../../src/bus/evenements/TestExpositionRealise.js';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';

describe("L'abonnement qui consigne la réalisation d'un test d'exposition dans le journal", () => {
  it('consigne un évènement de TestExpositionRéalisé', () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    consigneEvenementTestExpositionRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new TestExpositionRéalisé('tpe-pme-eti', 'sante', ['reputation', 'geo']));

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'TEST_EXPOSITION_REALISE');
    assert.equal(evenementRecu!.donnees.typeOrganisation, 'tpe-pme-eti');
    assert.equal(evenementRecu!.donnees.secteur, 'sante');
    assert.deepEqual(evenementRecu!.donnees.facteursAggravant, ['reputation', 'geo']);
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });
});
