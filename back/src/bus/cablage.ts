import { AdaptateurAnalytique } from '../infra/adaptateurAnalytique';
import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { BusEvenements } from './busEvenements';
import { consigneEvenementAvisUtilisateurDonneDansJournal } from './consigneEvenementAvisUtilisateurDonneDansJournal';
import { consigneEvenementCompteCreeDansJournal } from './consigneEvenementCompteCreeDansJournal';
import { consigneEvenementMAJFavorisUtilisateurDansJournal } from './consigneEvenementMAJFavorisUtilisateurDansJournal';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from './consigneEvenementProprieteTestRevendiqueeDansJournal';
import { consigneEvenementRetourExperienceDonneDansJournal } from './consigneEvenementRetourExperienceDonneDansJournal';
import { consigneEvenementTestRealiseDansJournal } from './consigneEvenementTestRealiseDansJournal';
import { creeContactBrevo } from './creeContactBrevo';
import { envoieEmailCreationCompte } from './envoieEmailCreationCompte';
import { AvisUtilisateurDonne } from './evenements/avisUtilisateurDonne';
import { CompteCree } from './evenements/compteCree';
import { DocumentGuideTelecharge } from './evenements/documentGuideTelecharge';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne';
import { TestRealise } from './evenements/testRealise';
import { VisaTelecharge } from './evenements/visaTelecharge';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur';
import { rapporteEvenementGuideTelechargeDansTraqueur } from './rapporteEvenementGuideTelechargeDansTraqueur';
import { rapporteEvenementVisaTelechargeDansTraqueur } from './rapporteEvenementVisaTelechargeDansTraqueur';

export const cableTousLesAbonnes = ({
  busEvenements,
  adaptateurAnalytique,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
  entrepotFavori,
}: {
  busEvenements: BusEvenements;
  adaptateurAnalytique: AdaptateurAnalytique;
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
  busEvenements.abonne(
    AvisUtilisateurDonne,
    consigneEvenementAvisUtilisateurDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );

  busEvenements.abonne(
    DocumentGuideTelecharge,
    rapporteEvenementGuideTelechargeDansTraqueur({
      adaptateurAnalytique,
      adaptateurHorloge,
    })
  );

  busEvenements.abonne(
    VisaTelecharge,
    rapporteEvenementVisaTelechargeDansTraqueur({
      adaptateurAnalytique,
      adaptateurHorloge,
    })
  );
};
