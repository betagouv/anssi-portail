import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurAnalytique } from '../infra/adaptateurAnalytique';
import { DocumentGuideTelecharge } from './evenements/documentGuideTelecharge';

export const rapporteEvenementGuideTelechargeDansTraqueur = ({
  adaptateurAnalytique,
  adaptateurHorloge,
}: {
  adaptateurAnalytique: AdaptateurAnalytique;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async function (evenement: DocumentGuideTelecharge) {
    await adaptateurAnalytique.rapporteEvenement({
      donnees: evenement,
      type: 'DOCUMENT_GUIDE_TELECHARGE',
      date: adaptateurHorloge.maintenant(),
    });
  };
};
