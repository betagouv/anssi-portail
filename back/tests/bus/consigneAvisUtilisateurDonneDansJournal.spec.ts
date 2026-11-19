import { beforeEach, describe, expect, it } from 'vitest';
import { consigneAvisUtilisateurDonneDansJournal } from '../../src/bus/consigneAvisUtilisateurDonneDansJournal.js';
import { AvisUtilisateurDonne } from '../../src/bus/evenements/avisUtilisateurDonne.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne le don d'un avis utilisateur dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHachage: AdaptateurHachage;

  const consigneEvenementDansJournal = () => {
    return consigneAvisUtilisateurDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    });
  };

  beforeEach(() => {
    adaptateurHorloge = {
      maintenant: () => Temporal.Now.instant(),
      maintenantZoné: () => Temporal.Now.instant().toZonedDateTimeISO(Temporal.Now.timeZoneId()),
    };
    adaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };
  });

  it('consigne un évènement de AvisUtilisateurDonne', async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    adaptateurHorloge = {
      maintenant: () => Temporal.Instant.from('2025-03-10T00:00:00Z'),
      maintenantZoné: () => Temporal.Instant.from('2025-03-10T00:00:00Z').toZonedDateTimeISO(Temporal.Now.timeZoneId()),
    };

    await consigneEvenementDansJournal()(
      new AvisUtilisateurDonne({
        niveauDeSatisfaction: 2,
        emailDeContact: 'jean@dupont.fr',
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('AVIS_UTILISATEUR_DONNE');
    expect(evenementRecu!.donnees.niveauDeSatisfaction).toBe(2);
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
      new AvisUtilisateurDonne({
        niveauDeSatisfaction: 2,
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

    await consigneEvenementDansJournal()(
      new AvisUtilisateurDonne({
        niveauDeSatisfaction: 2,
      })
    );

    expect(evenementRecu!.donnees.idUtilisateur).toBeUndefined();
  });
});
