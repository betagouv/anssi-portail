import { Request, Response, Router } from 'express';
import { createEventsAsync, EventAttributes } from 'ics';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRappelMiseAJourListeInterconnexions = ({
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

      const maintenant = adaptateurHorloge.maintenant();
      const fuseauHoraire = Temporal.Now.timeZoneId();
      const dansUnAn = maintenant.toZonedDateTimeISO(fuseauHoraire).add({ years: 1 });
      const dansUnAnÀNeufHeures = dansUnAn.add({ hours: 9 }).epochMilliseconds;
      const dansUnAnÀNeufHeuresTrente = dansUnAn.add({ hours: 9, minutes: 30 }).epochMilliseconds;

      const configurationÉvènement: EventAttributes = {
        start: dansUnAnÀNeufHeures,
        end: dansUnAnÀNeufHeuresTrente,
        title: "MesServicesCyber - Mettre à jour la liste des interconnexions du système d'information",
        description: [
          "Il y a un an, vous avez dressé la liste des interconnexions de votre système d'information avec les autres systèmes, avec un point de contact pour chacune. En cas d'incident, c'est cette liste qui vous permettra de savoir ce qui entre et sort de votre SI, et qui appeler.",
          "Pour qu'elle reste fiable, prenez quelques minutes pour la vérifier :",
          '- Des interconnexions ont-elles été ajoutées, modifiées ou supprimées (VPN, services en ligne, télémaintenance, flux avec des partenaires) ?',
          '- Les systèmes concernés, des deux côtés, sont-ils toujours les mêmes ?',
          '- Les points de contact opérationnels chez vos partenaires et prestataires sont-ils toujours valides ?',
          'Pensez ensuite à dater la nouvelle version et à remplacer les anciens exemplaires.',
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
            description: "Rappel : mettre à jour la liste des interconnexions du système d'information",
          },
        ],
      };
      const évènement = await createEventsAsync([configurationÉvènement]);

      réponse.attachment('rappel-mise-a-jour-liste-interconnexions.ics');
      réponse.contentType('text/calendar');
      réponse.send(évènement.value);
      await busEvenements.publie(
        new OutilTéléchargé(utilisateur.email, 'rappel-mise-a-jour-liste-interconnexions.ics')
      );
    }
  );

  return routeur;
};
