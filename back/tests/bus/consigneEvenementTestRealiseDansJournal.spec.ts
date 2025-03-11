import { describe, it } from 'node:test';
import {
  consigneEvenementTestRealiseDansJournal
} from '../../src/bus/consigneEvenementTestRealiseDansJournal';
import { TestRealise } from '../../src/bus/testRealise';
import assert from 'node:assert';
import {AdaptateurHorloge} from "../../src/infra/adaptateurHorloge";
import {AdaptateurJournal} from "../../src/infra/adaptateurJournal";

describe("L'abonnement qui consigne la réalisation d'un test dans le journal", () => {
  it('consigne un évènement de NouveauTestRealise', () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: any) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date("2025-03-10"),
    }

    consigneEvenementTestRealiseDansJournal({ adaptateurJournal, adaptateurHorloge })(
      new TestRealise({
        region: 'Auvergne-Rhône-Alpes',
        reponses: { pilotage: 2 },
        secteur: 'A',
        tailleOrganisation: '00',
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, "TEST_REALISE");
    assert.equal(evenementRecu!.donnees.region, "Auvergne-Rhône-Alpes");
    assert.deepEqual(evenementRecu!.donnees.reponses, { pilotage: 2 });
    assert.equal(evenementRecu!.donnees.secteur, "A");
    assert.equal(evenementRecu!.donnees.tailleOrganisation, "00");
    assert.deepEqual(evenementRecu!.date, new Date("2025-03-10"));
  });
});
