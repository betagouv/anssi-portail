import { beforeEach, describe, expect, it } from 'vitest';

import { consigneRetourExperienceDonneDansJournal } from '@bus/consigneRetourExperienceDonneDansJournal.js';
import { RetourExperienceDonne } from '@bus/evenements/retourExperienceDonne.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '@infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';

import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne le don d'un retour d’expérience dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHachage: AdaptateurHachage;

  const consigneEvenementDansJournal = () => {
    return consigneRetourExperienceDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    });
  };

  beforeEach(() => {
    adaptateurHorloge = fabriqueAdaptateurHorloge();
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
    adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneEvenementDansJournal()(
      new RetourExperienceDonne({
        raison: 'pas-besoin',
        emailDeContact: 'jean@dupont.fr',
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('RETOUR_EXPERIENCE_DONNE');
    expect(evenementRecu!.donnees.raison).toBe('pas-besoin');
    expect(evenementRecu!.date).toEqual(Temporal.Instant.from('2025-03-10T00:00:00Z'));
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

    expect(evenementRecu!.donnees.idUtilisateur).toBe(`jean@dupont.fr-hacheHMAC`);
  });

  it("ne consigne pas d'email si celui-ci est absent", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await consigneEvenementDansJournal()(new RetourExperienceDonne({ raison: 'x' }));

    expect(evenementRecu!.donnees.idUtilisateur).toBeUndefined();
  });
});
