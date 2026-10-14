import { Router } from 'express';
import { createEventsAsync, EventAttributes } from 'ics';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRappelMiseAJourAnnuaireContacts = ({ adaptateurHorloge }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', valideCorpsRequete(corpsVide), async (_, réponse) => {
    const maintenant = adaptateurHorloge.maintenant();
    const dansUnAn: [number, number, number] = [
      maintenant.getFullYear() + 1,
      maintenant.getMonth() + 1,
      maintenant.getDate(),
    ];

    const configurationÉvènement: EventAttributes = {
      start: dansUnAn,
      end: dansUnAn,
      title: "MesServicesCyber - Mettre à jour l'annuaire de contacts en cas de crise cyber",
      description: `Il y a un an, vous avez constitué votre annuaire de crise cyber. En cas d'attaque, c'est ce document, imprimé et lisible sans réseau, qui vous permettra de joindre les bonnes personnes rapidement.\n
Pour qu'il reste fiable, prenez quelques minutes pour le vérifier :\n
- Les personnes ont-elles changé (départ, arrivée, changement de poste) ?\n
- Vos prestataires et leurs contacts (informatique, hébergeur, assureur, banque) sont-ils toujours les mêmes ?\n
- Les numéros et adresses e-mail sont-ils toujours valides ?\n
\n
Pensez ensuite à dater la nouvelle version, à réimprimer le document et à remplacer les anciens exemplaires, y compris ceux conservés hors du bureau.\n
- Retrouvez le modèle et la mesure sur MesServicesCyber : https://messervices.cyber.gouv.fr`,
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
          description: "RAPPEL : mettre à jour l'annuaire de contacts en cas de crise cyber",
        },
      ],
    };
    const évènement = await createEventsAsync([configurationÉvènement]);
    réponse.attachment('rappel-mise-a-jour-annuaire-contacts.ics');
    réponse.contentType('text/calendar');
    réponse.send(évènement.value);
  });

  return routeur;
};
