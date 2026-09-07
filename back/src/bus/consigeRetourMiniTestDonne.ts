import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { DonneesEvenement } from '../infra/donneesEvenement.js';
import { RetourMiniTestDonné } from './evenements/retourMiniTestDonne.js';

type ÉvènementsMiniTest = Extract<DonneesEvenement, { type: 'RETOUR_TEST_MATURITE_DONNE' }>;

export const consigneRetourMiniTestDonné = ({
  adaptateurJournal,
  adaptateurHorloge,
}: {
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  return async (évènement: RetourMiniTestDonné) => {
    const type = ((): ÉvènementsMiniTest['type'] => {
      switch (évènement.miniTest) {
        case 'test-maturité':
          return 'RETOUR_TEST_MATURITE_DONNE';
        default:
          throw new Error(`mini-test "${évènement.miniTest}" non pris en charge`);
      }
    })();

    await adaptateurJournal.consigneEvenement({
      donnees: {
        commentaire: évènement.commentaire,
        retour: évènement.retour,
      },
      type,
      date: adaptateurHorloge.maintenant(),
    });
  };
};
