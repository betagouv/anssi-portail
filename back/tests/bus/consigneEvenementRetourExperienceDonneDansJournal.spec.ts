import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { consigneEvenementRetourExperienceDonneDansJournal } from '../../src/bus/consigneEvenementRetourExperienceDonneDansJournal.js';
import { RetourExperienceDonne } from '../../src/bus/evenements/retourExperienceDonne.js';

describe("L'abonnement qui consigne le don d'un retour d’expérience dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHachage: AdaptateurHachage;

  const consigneEvenementDansJournal = () => {
    return consigneEvenementRetourExperienceDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    });
  };

  beforeEach(() => {
    adaptateurHorloge = { maintenant: () => new Date() };
    adaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };
  });

  it('consigne un évènement de RetourExperienceDonne', async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    adaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneEvenementDansJournal()(
      new RetourExperienceDonne({
        raison: 'pas-besoin',
        emailDeContact: 'jean@dupont.fr',
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'RETOUR_EXPERIENCE_DONNE');
    assert.equal(evenementRecu!.donnees.raison, 'pas-besoin');
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });

  it("hache l'email de l'utilisateur", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await consigneEvenementDansJournal()(
      new RetourExperienceDonne({
        raison: 'x',
        emailDeContact: 'jean@dupont.fr',
      })
    );

    assert.equal(evenementRecu!.donnees.idUtilisateur, `jean@dupont.fr-hacheHMAC`);
  });

  it("ne consigne pas d'email si celui-ci est absent", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await consigneEvenementDansJournal()(new RetourExperienceDonne({ raison: 'x' }));

    assert.equal(evenementRecu!.donnees.idUtilisateur, undefined);
  });
});
