import { AdaptateurAnalytique } from '../infra/adaptateurAnalytique';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { VisaTelecharge } from './evenements/visaTelecharge';

export const rapporteEvenementVisaTelechargeDansTraqueur = ({
  adaptateurAnalytique,
  adaptateurHorloge,
}: {
  adaptateurAnalytique: AdaptateurAnalytique;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: VisaTelecharge) {
    await adaptateurAnalytique.rapporteEvenement({
      donnees: evenement,
      type: 'VISA_TELECHARGE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
