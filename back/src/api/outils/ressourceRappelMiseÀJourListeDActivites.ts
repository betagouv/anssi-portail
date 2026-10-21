import { Request, Response, Router } from 'express';
import { createEventsAsync, EventAttributes } from 'ics';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRappelMiseAJourListeDActivités = ({
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
      const dansUnAn: [number, number, number] = [
        maintenant.getFullYear() + 1,
        maintenant.getMonth() + 1,
        maintenant.getDate(),
      ];

      const configurationÉvènement: EventAttributes = {
        start: dansUnAn,
        end: dansUnAn,
        title: "MesServicesCyber - Mettre à jour la liste d'activités",
        description: `Il y a un an, vous avez recensé les activités et les systèmes à protéger en priorité. C’est ce document, tenu à jour, qui vous permet de savoir ce qui doit être sécurisé et remis en marche en premier en cas d’attaque.\n
\n
Pour qu’il reste fiable, prenez quelques minutes pour le vérifier :\n
- Les activités prioritaires sont-elles toujours les mêmes (nouvelle activité, activité arrêtée ou devenue critique) ?\n
- Les responsables de chaque activité ont-ils changé (départ, arrivée, changement de poste) ?\n
- Les outils, logiciels, équipements et services numériques utilisés sont-ils toujours les mêmes (nouvel outil, ancien serveur ou équipement oublié, changement de prestataire) ?\n
\n
Pensez ensuite à dater la nouvelle version et à remplacer l’ancienne, y compris les exemplaires partagés avec vos collaborateurs.\n
\n
Retrouvez le modèle et la mesure sur MesServicesCyber : [https://messervicescyber.beta.gouv.fr](https://messervicescyber.beta.gouv.fr)`,
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
            description: "RAPPEL : mettre à jour la liste d'activités",
          },
        ],
      };
      const évènement = await createEventsAsync([configurationÉvènement]);

      réponse.attachment('rappel-mise-a-jour-liste-d-activites.ics');
      réponse.contentType('text/calendar');
      réponse.send(évènement.value);
      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'rappel-mise-a-jour-liste-d-activites.ics'));
    }
  );

  return routeur;
};
