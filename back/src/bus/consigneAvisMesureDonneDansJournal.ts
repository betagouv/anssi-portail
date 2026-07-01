import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { AvisMesureDonne } from './evenements/avisMesureDonne.js';

export const consigneRetourAvisMesureDonneDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async (evenement: AvisMesureDonne) => {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: evenement.idUtilisateur,
        idMesure: evenement.idMesure,
        titreMesure: evenement.titreMesure,
        retour: evenement.retour,
      },
      type: 'AVIS_MESURE_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};

export const consigneCommentaireAvisMesureDonneDansMessagerie = ({
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
