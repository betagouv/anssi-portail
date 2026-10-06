import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { RetourArticleDonné } from './evenements/retourArticleDonne.js';

export const notifieUnRetourNégatifSurArticle = ({
  messagerieInstantanee,
}: {
  messagerieInstantanee: MessagerieInstantanee;
}) => {
  return async (évènement: RetourArticleDonné) => {
    if (évènement.retour !== 'NEGATIF') return;
    await messagerieInstantanee.notifieUnRetourNégatifSurArticle({
      slug: évènement.slug,
      commentaire: évènement.commentaire,
    });
  };
};
