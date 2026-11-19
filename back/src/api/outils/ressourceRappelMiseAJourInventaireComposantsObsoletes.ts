import { Request, Response, Router } from 'express';
import { createEventsAsync, EventAttributes } from 'ics';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRappelMiseAJourInventaireComposantsObsoletes = ({
  adaptateurHachage,
  adaptateurHorloge,
  busEvenements,
  entrepotUtilisateur,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    async (requête: Request, réponse: Response) => {
      const utilisateur = requête.utilisateur as Utilisateur;

      const dansUnAn = adaptateurHorloge.maintenantZoné().add({ years: 1 });
      const dansUnAnÀNeufHeures = dansUnAn.with({ hour: 9, minute: 0, second: 0 }).epochMilliseconds;
      const dansUnAnÀNeufHeuresTrente = dansUnAn.with({ hour: 9, minute: 30, second: 0 }).epochMilliseconds;

      const configurationÉvènement: EventAttributes = {
        start: dansUnAnÀNeufHeures,
        end: dansUnAnÀNeufHeuresTrente,
        title: "MesServicesCyber - Revoir l'inventaire des composants obsolètes",
        description: [
          "Vérifier que l'inventaire des composants obsolètes est à jour : nouveaux composants, statuts, mesures de compensation et échéances de remplacement.",
          '- Retrouvez le modèle et la mesure sur MesServicesCyber : https://messervices.cyber.gouv.fr',
        ].join('\n\n'),
        productId: '-//ANSSI//NONSGML MesServicesCyber//FR',
        recurrenceRule: 'FREQ=YEARLY',
        alarms: [
          {
            action: 'display',
            trigger: {
              hours: 0,
              minutes: 0,
              before: true,
            },
            description: "Rappel : revoir l'inventaire des composants obsolètes",
          },
        ],
      };
      const évènement = await createEventsAsync([configurationÉvènement]);

      réponse.attachment('rappel-mise-a-jour-inventaire-composants-obsoletes.ics');
      réponse.contentType('text/calendar');
      réponse.send(évènement.value);
      await busEvenements.publie(
        new OutilTéléchargé(utilisateur.email, 'rappel-mise-a-jour-inventaire-composants-obsoletes.ics')
      );
    }
  );

  return routeur;
};
