import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { BadgeCyberdépartDébloqué } from './evenements/badgeCyberdepartDebloque';

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
      },
      type: 'BADGE_CYBERDEPART_DEBLOQUE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
