import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { MesurePriseEnCompte } from './evenements/mesurePriseEnCompte.js';

export const consigneEvenementMesurePriseEnCompteDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: MesurePriseEnCompte) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idMesure: evenement.idMesure,
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        nombreDeMesures: evenement.nombreDeMesures,
        parcours: evenement.parcours,
        position: evenement.position,
      },
      type: 'MESURE_PRISE_EN_COMPTE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
