import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurAnalytique } from '../infra/adaptateurAnalytique';
import { GuideTelecharge } from './evenements/guideTelecharge';

export const rapporteEvenementGuideTelechargeDansTraqueur = ({
  adaptateurAnalytique,
  adaptateurHorloge,
}: {
  adaptateurAnalytique: AdaptateurAnalytique;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: GuideTelecharge) {
    await adaptateurAnalytique.rapporteEvenement({
      donnees: evenement,
      type: 'GUIDE_TELECHARGE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
