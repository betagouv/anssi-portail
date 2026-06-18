import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge';
import { AdaptateurJournal } from '../infra/adaptateurJournal';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee';
import { BusEvenements } from './busEvenements';
import {
  consigneCommentaireAvisMesureDonneDansMessagerie,
  consigneRetourAvisMesureDonneDansJournal,
} from './consigneAvisMesureDonneDansJournal';
import { consigneEvenementAvisUtilisateurDonneDansJournal } from './consigneEvenementAvisUtilisateurDonneDansJournal';
import { consigneBadgeCyberdépartDébloquéDansJournal } from './consigneBadgeCyberdepartDebloqueDansJournal';
import { consigneEvenementCompteCreeDansJournal } from './consigneEvenementCompteCreeDansJournal';
import { consigneEvenementMAJFavorisUtilisateurDansJournal } from './consigneEvenementMAJFavorisUtilisateurDansJournal';
import { consigneEvenementMesureConsulteeDansJournal } from './consigneEvenementMesureConsulteeDansJournal';
import { consigneEvenementMesurePriseEnCompteDansJournal } from './consigneEvenementMesurePriseEnCompteDansJournal';
import { consigneEvenementModuleTerminéDansJournal } from './consigneEvenementModuleTerminéDansJournal';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from './consigneEvenementProprieteTestRevendiqueeDansJournal';
import { consigneEvenementRetourExperienceDonneDansJournal } from './consigneEvenementRetourExperienceDonneDansJournal';
import { consigneEvenementSimulationNis2TermineeDansJournal } from './consigneEvenementSimulationNis2TermineeDansJournal';
import { consigneEvenementTestRealiseDansJournal } from './consigneEvenementTestRealiseDansJournal';
import { consigneEvenementUtilisateurConnecteDansJournal } from './consigneEvenementUtilisateurConnecteDansJournal';
import { creeContactBrevo } from './creeContactBrevo';
import { envoieEmailCreationCompte } from './envoieEmailCreationCompte';
import { AvisMesureDonne } from './evenements/avisMesureDonne';
import { AvisUtilisateurDonne } from './evenements/avisUtilisateurDonne';
import { BadgeCyberdépartDébloqué } from './evenements/badgeCyberdepartDebloque';
import { CompteCree } from './evenements/compteCree';
import { MesureConsultee } from './evenements/mesureConsultee';
import { MesurePriseEnCompte } from './evenements/mesurePriseEnCompte';
import { ModuleTermine } from './evenements/moduleTermine';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee';
import { TestRealise } from './evenements/testRealise';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur';

export const cableTousLesAbonnes = ({
  busEvenements,
  adaptateurEmail,
  adaptateurJournal,
  adaptateurHorloge,
  adaptateurHachage,
  entrepotFavori,
  messagerieInstantanee,
}: {
  busEvenements: BusEvenements;
  adaptateurEmail: AdaptateurEmail;
  adaptateurJournal: AdaptateurJournal;
  adaptateurHorloge: AdaptateurHorloge;
  adaptateurHachage: AdaptateurHachage;
  entrepotFavori: EntrepotFavori;
  messagerieInstantanee: MessagerieInstantanee;
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
    UtilisateurConnecte,
    consigneEvenementUtilisateurConnecteDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );

  busEvenements.abonne(
    SimulationNis2Terminee,
    consigneEvenementSimulationNis2TermineeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );

  busEvenements.abonne(
    MesureConsultee,
    consigneEvenementMesureConsulteeDansJournal({ adaptateurJournal, adaptateurHorloge })
  );

  busEvenements.abonnePlusieurs(AvisMesureDonne, [
    consigneRetourAvisMesureDonneDansJournal({ adaptateurJournal, adaptateurHorloge }),
    consigneCommentaireAvisMesureDonneDansMessagerie({ messagerieInstantanee }),
  ]);

  busEvenements.abonne(
    MesurePriseEnCompte,
    consigneEvenementMesurePriseEnCompteDansJournal({ adaptateurJournal, adaptateurHorloge })
  );

  busEvenements.abonne(
    ModuleTermine,
    consigneEvenementModuleTerminéDansJournal({ adaptateurJournal, adaptateurHorloge })
  );

  busEvenements.abonne(
    BadgeCyberdépartDébloqué,
    consigneBadgeCyberdépartDébloquéDansJournal({ adaptateurJournal, adaptateurHorloge })
  );
};
