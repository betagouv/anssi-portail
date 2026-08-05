import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { CompteCree } from '../../src/bus/evenements/compteCree.js';
import { consigneEvenementCompteCreeDansJournal } from '../../src/bus/consigneEvenementCompteCreeDansJournal.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne la création d'un compte utilisateur dans le journal", () => {
  it("consigne un évènement avec les données de l'utilisateur", async () => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donnéesÉvÈnement: unknown) => {
        évènementReçu = donnéesÉvÈnement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneEvenementCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new CompteCree({
        email: 'u1@mail.com',
        nom: 'dupont',
        prenom: 'jean',
        infoLettre: false,
        pixelDeSuiviAccepté: true,
      })
    );

    assert.notEqual(évènementReçu, undefined);
    assert.equal(évènementReçu!.type, 'NOUVEL_UTILISATEUR_INSCRIT');
    assert.equal(évènementReçu!.donnees?.idUtilisateur, 'u1@mail.com-hacheHMAC');
    assert.deepEqual(évènementReçu!.date, new Date('2025-03-10'));
  });

  it("consigne un évènement avec la provenance de l'utilisateur", async () => {
    let évènementReçu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donnéesÉvÈnement: unknown) => {
        évènementReçu = donnéesÉvÈnement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneEvenementCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new CompteCree({
        email: 'u1@mail.com',
        nom: 'dupont',
        prenom: 'jean',
        infoLettre: false,
        pixelDeSuiviAccepté: true,
        suivi: {
          campagne: 'campagne_aout_2026',
        },
      })
    );

    assert.equal(évènementReçu!.donnees?.suivi.campagne, 'campagne_aout_2026');
  });
});
