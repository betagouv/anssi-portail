import axios from '@anssi-portail/axios';
import {
  AvisNegatifSurUneMesure,
  AvisUtilisateur,
  MessagerieInstantanee,
  RetourExperience,
  RetourNégatifSurMiniTest,
} from '../metier/messagerieInstantanee.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { aseptiseMarkdown } from './markdown.js';

export const messagerieMattermost = ({
  adaptateurEnvironnement,
}: {
  adaptateurEnvironnement: AdaptateurEnvironnement;
}): MessagerieInstantanee => ({
  notifieUnRetourExperience: async (retourExperience: RetourExperience) => {
    const urlWebhook = adaptateurEnvironnement.mattermost().webhookRetourExperience();
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
    const urlWebhook = adaptateurEnvironnement.mattermost().webhookAvisUtilisateur();

    if (urlWebhook) {
      const message = `### Avis utilisateur
Un utilisateur a laissé un avis
Niveau de satisfaction : ${avisUtilisateur.niveauDeSatisfaction}
Commentaire : ${aseptiseMarkdown(avisUtilisateur.commentaire ?? '')}
Email de contact : ${avisUtilisateur.emailDeContact}`;
      await axios.post(urlWebhook, { text: message });
    }
  },

  notifieUnAvisNegatifSurUneMesure: async (avis: AvisNegatifSurUneMesure) => {
    const urlWebhook = adaptateurEnvironnement.mattermost().webhookAvisMesure();

    if (urlWebhook) {
      const message = `### :alert: Avis négatif sur la mesure ${avis.idMesure}
**Titre :** ${avis.titreMesure}
Un utilisateur a laissé un avis négatif :
${aseptiseMarkdown(avis.commentaire ?? '')}`;
      await axios.post(urlWebhook, { text: message });
    }
  },

  notifieUnRetourNégatifSurMiniTest: async (retour: RetourNégatifSurMiniTest) => {
    const urlWebhook = adaptateurEnvironnement.mattermost().webhookAvisUtilisateur();

    const nomMiniTest = (() => {
      switch (retour.miniTest) {
        case 'test-maturité':
          return 'Test Maturité';
        case 'vrai-faux':
          return 'Test Vrai-Faux';
        case 'exposition':
          return 'Test Exposition';
        default:
          throw new Error(`mini-test "${retour.miniTest}" non pris en charge`);
      }
    })();

    if (urlWebhook) {
      const message = `### Retour utilisateur ${nomMiniTest}
Un utilisateur a laissé un retour négatif
${aseptiseMarkdown(retour.commentaire ? `Commentaire: ${retour.commentaire}` : 'Aucun commentaire laissé')}`;
      await axios.post(urlWebhook, { text: message });
    }
  },
});
