import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { consigneEvenementAvisUtilisateurDonneDansJournal } from '../../src/bus/consigneEvenementAvisUtilisateurDonneDansJournal';
import { AvisUtilisateurDonne } from '../../src/bus/evenements/avisUtilisateurDonne';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { fauxAdaptateurHachage } from '../api/fauxObjets';

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

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'AVIS_UTILISATEUR_DONNE');
    assert.equal(evenementRecu!.donnees.niveauDeSatisfaction, 2);
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
      new AvisUtilisateurDonne({
        niveauDeSatisfaction: 2,
        emailDeContact: 'jean@dupont.fr',
      })
    );

    assert.equal(
      evenementRecu!.donnees.idUtilisateur,
      `jean@dupont.fr-hacheHMAC`
    );
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

    assert.equal(evenementRecu!.donnees.idUtilisateur, undefined);
  });
});
