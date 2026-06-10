import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  consigneCommentaireAvisMesureDonneDansMessagerie,
  consigneRetourAvisMesureDonneDansJournal,
} from '../../src/bus/consigneAvisMesureDonneDansJournal';
import { AvisMesureDonne } from '../../src/bus/evenements/avisMesureDonne';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { fausseMessagerieInstantanee } from '../api/fauxObjets';

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
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        idMesure: 'AUTH.5',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
        retour: 'POSITIF',
      })
    );

    assert.deepEqual(evenementRecu, {
      type: 'AVIS_MESURE_DONNE',
      donnees: {
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        idMesure: 'AUTH.5',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
        retour: 'POSITIF',
      },
      date: new Date('2025-03-10'),
    });
  });
});

describe("L'abonnement qui consigne un avis négatif sur une mesure dans la messagerie", () => {
  it('consigne un évènement AvisMesureDonne', async () => {
    let evenementRecu;
    const messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
      notifieUnAvisNegatifSurUneMesure: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    await consigneCommentaireAvisMesureDonneDansMessagerie({ messagerieInstantanee })(
      new AvisMesureDonne({
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        idMesure: 'AUTH.5',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
        retour: 'NEGATIF',
        commentaire: 'Pas satisfait de cette mesure',
      })
    );

    assert.deepEqual(evenementRecu, {
      idMesure: 'AUTH.5',
      titreMesure:
        'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
      commentaire: 'Pas satisfait de cette mesure',
    });
  });
});
