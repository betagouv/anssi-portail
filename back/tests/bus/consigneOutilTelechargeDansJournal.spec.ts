import { beforeEach, describe, expect, it } from 'vitest';
import { consigneOutilTéléchargéDansJournal } from '@bus/consigneOutilTelechargeDansJournal.js';
import { OutilTéléchargé } from '@bus/evenements/outilTelecharge.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '@infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { jeanneDupont } from '../api/objetsPretsALEmploi.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne le téléchargement d'un outil dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHachage: AdaptateurHachage;

  beforeEach(() => {
    adaptateurHorloge = fabriqueAdaptateurHorloge();
    adaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };
  });

  it("consigne un évènement d' OutilTéléchargé ", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneOutilTéléchargéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new OutilTéléchargé(jeanneDupont.email, 'modele-annuaire-de-crise.xlsx'));

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('OUTIL_TÉLÉCHARGÉ');
    expect(evenementRecu!.donnees.outil).toBe('modele-annuaire-de-crise.xlsx');
  });

  it("hache l'email de l'utilisateur", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await consigneOutilTéléchargéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new OutilTéléchargé(jeanneDupont.email, 'modele-annuaire-de-crise.xlsx'));

    expect(evenementRecu!.donnees.idUtilisateur).toBe('jeanne.dupont@user.com-hacheHMAC');
  });
});
