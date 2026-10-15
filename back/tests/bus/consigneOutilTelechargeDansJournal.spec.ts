import { beforeEach, describe, expect, it } from 'vitest';
import { consigneOutilTéléchargéDansJournal } from '../../src/bus/consigneOutilTelechargeDansJournal.js';
import { OutilTéléchargé } from '../../src/bus/evenements/outilTelecharge.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { jeanneDupont } from '../api/objetsPretsALEmploi.js';

describe("L'abonnement qui consigne le téléchargement d'un outil dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHachage: AdaptateurHachage;

  beforeEach(() => {
    adaptateurHorloge = { maintenant: () => new Date() };
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
    adaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneOutilTéléchargéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new OutilTéléchargé(jeanneDupont.email, 'Modèle_annuaire_crise'));

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('OUTIL_TÉLÉCHARGÉ');
    expect(evenementRecu!.donnees.outil).toBe('Modèle_annuaire_crise');
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
    })(new OutilTéléchargé(jeanneDupont.email, 'Modèle_annuaire_crise'));

    expect(evenementRecu!.donnees.idUtilisateur).toBe('jeanne.dupont@user.com-hacheHMAC');
  });
});
