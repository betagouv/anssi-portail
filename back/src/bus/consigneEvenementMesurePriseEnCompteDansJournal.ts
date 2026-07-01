import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { MesurePriseEnCompte } from './evenements/mesurePriseEnCompte.js';

export const consigneEvenementMesurePriseEnCompteDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: MesurePriseEnCompte) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idMesure: evenement.idMesure,
        idUtilisateur: evenement.emailHache,
        nombreDeMesures: evenement.nombreDeMesures,
        position: evenement.position,
      },
      type: 'MESURE_PRISE_EN_COMPTE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
