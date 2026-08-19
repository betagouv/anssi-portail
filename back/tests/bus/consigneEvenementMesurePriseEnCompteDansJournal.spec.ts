import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneEvenementMesurePriseEnCompteDansJournal } from '../../src/bus/consigneEvenementMesurePriseEnCompteDansJournal.js';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne la prise en compte d'une mesure par un utilisateur dans le journal", () => {
  it('consigne un évènement MesurePriseEnCompte', async () => {
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

    await consigneEvenementMesurePriseEnCompteDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new MesurePriseEnCompte('u1@example.com', 'AUTH.5', 10, 2, 'allégé'));

    assert.deepEqual(evenementRecu, {
      type: 'MESURE_PRISE_EN_COMPTE',
      donnees: {
        idMesure: 'AUTH.5',
        idUtilisateur: 'u1@example.com-hacheHMAC',
        nombreDeMesures: 10,
        parcours: 'allégé',
        position: 2,
      },
      date: new Date('2025-03-10'),
    });
  });
});
