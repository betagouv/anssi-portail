import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { BadgeCyberdépartDébloqué } from './evenements/badgeCyberdepartDebloque.js';

export const consigneBadgeCyberdépartDébloquéDansJournal = ({
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
}) => {
  return async function (evenement: BadgeCyberdépartDébloqué) {
    await adaptateurJournal.consigneEvenement({
      donnees: {
        idUtilisateur: adaptateurHachage.hache(evenement.email),
        nombreMesuresActuel: evenement.nombreMesuresActuel,
        nombreMesuresTotal: evenement.nombreMesuresTotal,
      },
      type: 'BADGE_CYBERDEPART_DEBLOQUE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
