import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { RetourTestMaturitéDonné } from './evenements/retourTestMaturiteDonne.js';

export const notifieUnRetourNégatifSurTestMaturité = ({
  messagerieInstantanee,
}: {
  messagerieInstantanee: MessagerieInstantanee;
}) => {
  return async (évènement: RetourTestMaturitéDonné) => {
    if (évènement.retour !== 'NEGATIF') return;
    await messagerieInstantanee.notifieUnRetourNégatifSurTestMaturité({
      commentaire: évènement.commentaire,
    });
  };
};
