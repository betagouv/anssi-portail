import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
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
        idMesure: evenement.idMesure,
        idUtilisateur: evenement.idUtilisateur,
        parcours: evenement.parcours,
        retour: evenement.retour,
        titreMesure: evenement.titreMesure,
      },
      type: 'AVIS_MESURE_DONNE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
