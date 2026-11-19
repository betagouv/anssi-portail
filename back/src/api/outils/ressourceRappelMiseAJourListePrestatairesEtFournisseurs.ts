import { Request, Response, Router } from 'express';
import { createEventsAsync, EventAttributes } from 'ics';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRappelMiseAJourListePrestatairesEtFournisseurs = ({
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
        title: 'MesServicesCyber - Mettre à jour la liste des prestataires et fournisseurs',
        description: [
          "Il y a un an, vous avez constitué la liste de vos prestataires et fournisseurs informatiques avec leurs coordonnées. En cas d'incident, c'est cette liste qui vous permettra de joindre rapidement les bonnes personnes.",
          "Pour qu'elle reste fiable, prenez quelques minutes pour la vérifier :",
          '- Vos prestataires et fournisseurs ont-ils changé (nouveau prestataire, fin de contrat) ?',
          '- Les contacts opérationnels et les contacts de secours sont-ils toujours les mêmes (départ, arrivée, changement de poste) ?',
          "- Les numéros de téléphone, adresses e-mail et modalités d'astreinte sont-ils toujours valides ?",
          'Pensez ensuite à dater la nouvelle version et à remplacer les anciens exemplaires, y compris ceux conservés hors du bureau.',
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
            description: 'RAPPEL : mettre à jour la liste de vos prestataires et fournisseurs',
          },
        ],
      };
      const évènement = await createEventsAsync([configurationÉvènement]);

      réponse.attachment('rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics');
      réponse.contentType('text/calendar');
      réponse.send(évènement.value);
      await busEvenements.publie(
        new OutilTéléchargé(utilisateur.email, 'rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics')
      );
    }
  );

  return routeur;
};
