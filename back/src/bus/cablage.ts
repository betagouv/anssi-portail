import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { EntrepotFavori } from '../metier/entrepotFavori.js';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { BusEvenements } from './busEvenements.js';
import { consigneRetourAvisMesureDonneDansJournal } from './consigneAvisMesureDonneDansJournal.js';
import { consigneBadgeCyberdépartDébloquéDansJournal } from './consigneBadgeCyberdepartDebloqueDansJournal.js';
import { consigneEvenementAvisUtilisateurDonneDansJournal } from './consigneEvenementAvisUtilisateurDonneDansJournal.js';
import { consigneEvenementCompteCreeDansJournal } from './consigneEvenementCompteCreeDansJournal.js';
import { consigneEvenementMAJFavorisUtilisateurDansJournal } from './consigneEvenementMAJFavorisUtilisateurDansJournal.js';
import { consigneEvenementMesureConsulteeDansJournal } from './consigneEvenementMesureConsulteeDansJournal.js';
import { consigneEvenementMesurePriseEnCompteDansJournal } from './consigneEvenementMesurePriseEnCompteDansJournal.js';
import { consigneEvenementModuleTerminéDansJournal } from './consigneEvenementModuleTerminéDansJournal.js';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from './consigneEvenementProprieteTestRevendiqueeDansJournal.js';
import { consigneEvenementRetourExperienceDonneDansJournal } from './consigneEvenementRetourExperienceDonneDansJournal.js';
import { consigneEvenementSimulationNis2TermineeDansJournal } from './consigneEvenementSimulationNis2TermineeDansJournal.js';
import { consigneEvenementTestRealiseDansJournal } from './consigneEvenementTestRealiseDansJournal.js';
import { consigneEvenementUtilisateurConnecteDansJournal } from './consigneEvenementUtilisateurConnecteDansJournal.js';
import { consigneParcoursChangéDansJournal } from './consigneParcoursChangeDansJournal.js';
import { consigneParcoursRejointDansJournal } from './consigneParcoursRejointDansJournal.js';
import { creeContactBrevo } from './creeContactBrevo.js';
import { envoieEmailCreationCompte } from './envoieEmailCreationCompte.js';
import { AvisMesureDonne } from './evenements/avisMesureDonne.js';
import { AvisUtilisateurDonne } from './evenements/avisUtilisateurDonne.js';
import { BadgeCyberdépartDébloqué } from './evenements/badgeCyberdepartDebloque.js';
import { CompteCree } from './evenements/compteCree.js';
import { MesureConsultee } from './evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from './evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from './evenements/moduleTermine.js';
import { ParcoursChangé } from './evenements/parcoursChange.js';
import { ParcoursRejoint } from './evenements/parcoursRejoint.js';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee.js';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne.js';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee.js';
import { TestRealise } from './evenements/testRealise.js';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte.js';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur.js';
import { notifieCommentaireAvisMesureDonneDansMessagerie } from './notifieCommentaireAvisMesureDonneDansMessagerie.js';

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
    consigneEvenementMesureConsulteeDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage })
  );

  busEvenements.abonnePlusieurs(AvisMesureDonne, [
    consigneRetourAvisMesureDonneDansJournal({ adaptateurJournal, adaptateurHorloge }),
    notifieCommentaireAvisMesureDonneDansMessagerie({ messagerieInstantanee }),
  ]);

  busEvenements.abonne(
    MesurePriseEnCompte,
    consigneEvenementMesurePriseEnCompteDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage })
  );

  busEvenements.abonne(
    ModuleTermine,
    consigneEvenementModuleTerminéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage })
  );

  busEvenements.abonne(
    BadgeCyberdépartDébloqué,
    consigneBadgeCyberdépartDébloquéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage })
  );

  busEvenements.abonne(
    ParcoursRejoint,
    consigneParcoursRejointDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage })
  );

  busEvenements.abonne(
    ParcoursChangé,
    consigneParcoursChangéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage })
  );
};
