import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { RetourOutilDonné } from './evenements/retourOutilDonne.js';

export const notifieUnRetourNégatifSurOutil = ({
  messagerieInstantanee,
}: {
  messagerieInstantanee: MessagerieInstantanee;
}) => {
  return async (évènement: RetourOutilDonné) => {
    if (évènement.retour !== 'NEGATIF') return;
    await messagerieInstantanee.notifieUnRetourNégatifSurOutil({
      outil: évènement.outil,
      commentaire: évènement.commentaire,
    });
  };
};
