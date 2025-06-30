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
import { consigneEvenementCompteCreeDansJournal } from './consigneEvenementCompteCreeDansJournal';
import { consigneEvenementMAJFavorisUtilisateurDansJournal } from './consigneEvenementMAJFavorisUtilisateurDansJournal';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne';
import { consigneEvenementRetourExperienceDonneDansJournal } from './consigneEvenementRetourExperienceDonneDansJournal';

export const cableTousLesAbonnes = ({
  busEvenements,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
  entrepotFavori,
}: {
  busEvenements: BusEvenements;
  adaptateurEmail: AdaptateurEmail;
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
  entrepotFavori: EntrepotFavori;
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
      adaptateurHachage,
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
      adaptateurHachage,
    }),
  ]);
  busEvenements.abonne(
    MiseAJourFavorisUtilisateur,
    consigneEvenementMAJFavorisUtilisateurDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
      entrepotFavori,
    })
  );
  busEvenements.abonne(
    RetourExperienceDonne,
    consigneEvenementRetourExperienceDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );
};
