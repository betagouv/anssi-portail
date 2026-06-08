import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee';
import { AvisMesureDonne } from './evenements/avisMesureDonne';

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
        idMesure: evenement.idMesure,
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
      commentaire: evenement.commentaire,
    });
  };
};
