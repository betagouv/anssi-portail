import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { MesureConsultee } from './evenements/mesureConsultee';

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
