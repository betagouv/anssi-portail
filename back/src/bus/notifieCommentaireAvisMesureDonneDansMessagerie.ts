import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { AvisMesureDonne } from './evenements/avisMesureDonne.js';

export const notifieCommentaireAvisMesureDonneDansMessagerie = ({
  messagerieInstantanee,
}: {
  messagerieInstantanee: MessagerieInstantanee;
}) => {
  return async (evenement: AvisMesureDonne) => {
    if (evenement.retour !== 'NEGATIF') return;
    await messagerieInstantanee.notifieUnAvisNegatifSurUneMesure({
      idMesure: evenement.idMesure,
      titreMesure: evenement.titreMesure,
      commentaire: evenement.commentaire,
    });
  };
};
