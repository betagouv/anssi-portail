import axios from 'axios';
import {
  MessagerieInstantanee,
  RetourExperience,
} from '../metier/messagerieInstantanee';
import { aseptiseMarkdown } from './markdown';

export const messagerieMattermost = (): MessagerieInstantanee => ({
  notifieUnRetourExperience: async (retourExperience: RetourExperience) => {
    const urlWebhook = process.env.WEBHOOK_MATTERMOST_RETOURS_EXPERIENCE;
    if (urlWebhook) {
      const message = `### Retour utilisateur
Un utilisateur a laissé un retour d’expérience suite à la non-complétion du formulaire de demande d’aide
Raison : ${retourExperience.raison}
Précision : ${aseptiseMarkdown(retourExperience.precision ?? '')}
Email de contact : ${retourExperience.emailDeContact}`;

      await axios.post(urlWebhook, { text: message });
    }
  },

  notifieUnAvisUtilisateur: async () => {},
});
