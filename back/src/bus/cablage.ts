import { BusEvenements } from './busEvenements';
import { TestRealise } from './evenements/testRealise';
import { consigneEvenementTestRealiseDansJournal } from './consigneEvenementTestRealiseDansJournal';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from './consigneEvenementProprieteTestRevendiqueeDansJournal';
import { CompteCree } from './evenements/compteCree';
import { envoieEmailCreationCompte } from './envoieEmailCreationCompte';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { creeContactBrevo } from './creeContactBrevo';
import {
  consigneEvenementCompteCreeDansJournal,
} from './consigneEvenementCompteCreeDansJournal';
import { AdaptateurChiffrement } from '../infra/adaptateurChiffrement';

export const cableTousLesAbonnes = ({
  busEvenements,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurChiffrement,
}: {
  busEvenements: BusEvenements;
  adaptateurEmail: AdaptateurEmail;
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurChiffrement: AdaptateurChiffrement;
}) => {
  busEvenements.abonne(
    TestRealise,
    consigneEvenementTestRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );
  busEvenements.abonne(
    ProprieteTestRevendiquee,
    consigneEvenementProprieteTestRevendiqueeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );
  busEvenements.abonnePlusieurs(CompteCree, [
    envoieEmailCreationCompte({
      adaptateurEmail,
    }),
    creeContactBrevo({
      adaptateurEmail,
    }),
    consigneEvenementCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurChiffrement,
    }),
  ]);
};
