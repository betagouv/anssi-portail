import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { MesureConsultee } from './evenements/mesureConsultee.js';

export const consigneEvenementMesureConsulteeDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: MesureConsultee) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idMesure: evenement.idMesure,
        idUtilisateur: evenement.emailHache,
      },
      type: 'MESURE_CONSULTEE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
