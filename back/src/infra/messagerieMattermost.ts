import axios from 'axios';
import {
  AvisUtilisateur,
  MessagerieInstantanee,
  RetourExperience,
} from '../metier/messagerieInstantanee';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { aseptiseMarkdown } from './markdown';

export const messagerieMattermost = ({
  adaptateurEnvironnement,
}: {
  adaptateurEnvironnement: AdaptateurEnvironnement;
}): MessagerieInstantanee => ({
  notifieUnRetourExperience: async (retourExperience: RetourExperience) => {
    const urlWebhook = adaptateurEnvironnement
      .mattermost()
      .webhookRetourExperience();
    if (urlWebhook) {
      const message = `### Retour utilisateur
Un utilisateur a laissé un retour d’expérience suite à la non-complétion du formulaire de demande d’aide
Raison : ${retourExperience.raison}
Précision : ${aseptiseMarkdown(retourExperience.precision ?? '')}
Email de contact : ${retourExperience.emailDeContact}`;

      await axios.post(urlWebhook, { text: message });
    }
  },

  notifieUnAvisUtilisateur: async (avisUtilisateur: AvisUtilisateur) => {
    const urlWebhook = adaptateurEnvironnement
      .mattermost()
      .webhookAvisUtilisateur();

    if (urlWebhook) {
      const message = `### Avis utilisateur
Un utilisateur a laissé un avis
Niveau de satisfaction : ${avisUtilisateur.niveauDeSatisfaction}
Commentaire : ${aseptiseMarkdown(avisUtilisateur.commentaire ?? '')}
Email de contact : ${avisUtilisateur.emailDeContact}`;
      await axios.post(urlWebhook, { text: message });
    }
  },
});
