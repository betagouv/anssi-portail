import { beforeEach, describe, expect, it } from 'vitest';
import { consigneEvenementAvisUtilisateurDonneDansJournal } from '../../src/bus/consigneEvenementAvisUtilisateurDonneDansJournal.js';
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
    return consigneEvenementAvisUtilisateurDonneDansJournal({
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

  it('consigne un évènement de AvisUtilisateurDonne', async () => {
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
      new AvisUtilisateurDonne({
        niveauDeSatisfaction: 2,
        emailDeContact: 'jean@dupont.fr',
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('AVIS_UTILISATEUR_DONNE');
    expect(evenementRecu!.donnees.niveauDeSatisfaction).toBe(2);
    expect(evenementRecu!.date).toEqual(new Date('2025-03-10'));
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
