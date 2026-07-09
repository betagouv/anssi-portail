import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { BadgeCyberdépartDébloqué } from './evenements/badgeCyberdepartDebloque.js';

export const consigneBadgeCyberdépartDébloquéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: BadgeCyberdépartDébloqué) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: evenement.emailHache,
        nombreMesuresActuel: evenement.nombreMesuresActuel,
        nombreMesuresTotal: evenement.nombreMesuresTotal,
      },
      type: 'BADGE_CYBERDEPART_DEBLOQUE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
