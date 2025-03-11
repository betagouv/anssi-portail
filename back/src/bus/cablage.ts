import { BusEvenements } from './busEvenements';
import { TestRealise } from './testRealise';
import { consigneEvenementTestRealiseDansJournal } from './consigneEvenementTestRealiseDansJournal';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';

export const cableTousLesAbonnes = ({
  busEvenements,
  adaptateurJournal,
  adaptateurHorloge,
}: {
  busEvenements: BusEvenements;
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
}) => {
  busEvenements.abonne(
    TestRealise,
    consigneEvenementTestRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );
};
