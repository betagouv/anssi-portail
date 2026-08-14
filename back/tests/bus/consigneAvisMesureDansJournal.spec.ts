import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneRetourAvisMesureDonneDansJournal } from '../../src/bus/consigneAvisMesureDonneDansJournal.js';
import { AvisMesureDonne } from '../../src/bus/evenements/avisMesureDonne.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';

describe("L'abonnement qui consigne un avis sur une mesure dans le journal", () => {
  it('consigne un évènement AvisMesureDonne', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneRetourAvisMesureDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(
      new AvisMesureDonne({
        idMesure: 'AUTH.5',
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        parcours: 'allégé',
        retour: 'POSITIF',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
      })
    );

    assert.deepEqual(evenementRecu, {
      type: 'AVIS_MESURE_DONNE',
      donnees: {
        idMesure: 'AUTH.5',
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        parcours: 'allégé',
        retour: 'POSITIF',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
      },
      date: new Date('2025-03-10'),
    });
  });
});
