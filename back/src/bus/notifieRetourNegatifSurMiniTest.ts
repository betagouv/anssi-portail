import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { RetourMiniTestDonné } from './evenements/retourMiniTestDonne.js';

export const notifieUnRetourNégatifSurMiniTest = ({
  messagerieInstantanee,
}: {
  messagerieInstantanee: MessagerieInstantanee;
}) => {
  return async (évènement: RetourMiniTestDonné) => {
    if (évènement.retour !== 'NEGATIF') return;
    await messagerieInstantanee.notifieUnRetourNégatifSurMiniTest({
      miniTest: évènement.miniTest,
      commentaire: évènement.commentaire,
    });
  };
};
