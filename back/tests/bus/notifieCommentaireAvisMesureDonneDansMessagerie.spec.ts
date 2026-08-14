import assert from 'assert';
import { suite as describe, it } from 'node:test';
import { AvisMesureDonne } from '../../src/bus/evenements/avisMesureDonne.js';
import { notifieCommentaireAvisMesureDonneDansMessagerie } from '../../src/bus/notifieCommentaireAvisMesureDonneDansMessagerie.js';
import { fausseMessagerieInstantanee } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne un avis négatif sur une mesure dans la messagerie", () => {
  it('consigne un évènement AvisMesureDonne', async () => {
    let evenementRecu;
    const messagerieInstantanee = {
      ...fausseMessagerieInstantanee,
      notifieUnAvisNegatifSurUneMesure: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    await notifieCommentaireAvisMesureDonneDansMessagerie({ messagerieInstantanee })(
      new AvisMesureDonne({
        commentaire: 'Pas satisfait de cette mesure',
        idMesure: 'AUTH.5',
        idUtilisateur: 'jeanne.dupont@user.com-hache',
        parcours: 'allégé',
        retour: 'NEGATIF',
        titreMesure:
          'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
      })
    );

    assert.deepEqual(evenementRecu, {
      commentaire: 'Pas satisfait de cette mesure',
      idMesure: 'AUTH.5',
      titreMesure:
        'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes',
    });
  });
});
