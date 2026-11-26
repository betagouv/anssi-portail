import { describe, expect, it } from 'vitest';

import { consigneRetourAvisMesureDonneDansJournal } from '@bus/consigneAvisMesureDonneDansJournal.js';
import { AvisMesureDonne } from '@bus/evenements/avisMesureDonne.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';

import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne un avis sur une mesure dans le journal", () => {
  it('consigne un évènement AvisMesureDonne', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

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

    expect(evenementRecu).toEqual({
      type: 'AVIS_MESURE_DONNE',
      donnees: {
        idMesure: 'AUTH.5',
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        parcours: 'allégé',
        retour: 'POSITIF',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
