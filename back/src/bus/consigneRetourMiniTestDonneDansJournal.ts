import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { DonneesEvenement } from '../infra/donneesEvenement.js';
import { RetourMiniTestDonné } from './evenements/retourMiniTestDonne.js';

type ÉvènementsMiniTest = Extract<
  DonneesEvenement,
  { type: 'RETOUR_TEST_MATURITE_DONNE' | 'RETOUR_TEST_VRAI_FAUX_DONNÉ' | 'RETOUR_TEST_EXPOSITION_DONNÉ' }
>;

export const consigneRetourMiniTestDonnéDansJournal = ({
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
        case 'vrai-faux':
          return 'RETOUR_TEST_VRAI_FAUX_DONNÉ';
        case 'exposition':
          return 'RETOUR_TEST_EXPOSITION_DONNÉ';
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
