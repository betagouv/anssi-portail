import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { EntrepotFavori } from '../metier/entrepotFavori.js';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { BusEvenements } from './busEvenements.js';
import { consigneRetourTestMaturitéDonné } from './consigeRetourTestMaturiteDonne.js';
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
import { consigneParcoursAllégéTerminéDansJournal } from './consigneParcoursAllegeTermineDansJournal.js';
import { consigneParcoursChangéDansJournal } from './consigneParcoursChangeDansJournal.js';
import { consigneParcoursCompletTerminéDansJournal } from './consigneParcoursCompletTermineDansJournal.js';
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
import { ParcoursAllégéTerminé } from './evenements/parcoursAllegeTermine.js';
import { ParcoursChangé } from './evenements/parcoursChange.js';
import { ParcoursCompletTerminé } from './evenements/parcoursCompletTermine.js';
import { ParcoursRejoint } from './evenements/parcoursRejoint.js';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee.js';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne.js';
import { RetourTestMaturitéDonné } from './evenements/retourTestMaturiteDonne.js';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee.js';
import { TestRealise } from './evenements/testRealise.js';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte.js';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur.js';
import { notifieCommentaireAvisMesureDonneDansMessagerie } from './notifieCommentaireAvisMesureDonneDansMessagerie.js';
import { notifieUnRetourNégatifSurTestMaturité as notifieUnRetourNégatifSurTestMaturité } from './notifieRetourNegatifSurTestMaturite.js';

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

  busEvenements.abonnePlusieurs(MesureConsultee, [
    consigneEvenementMesureConsulteeDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourMesureConsultée,
  ]);

  busEvenements.abonnePlusieurs(AvisMesureDonne, [
    consigneRetourAvisMesureDonneDansJournal({ adaptateurJournal, adaptateurHorloge }),
    notifieCommentaireAvisMesureDonneDansMessagerie({ messagerieInstantanee }),
  ]);

  busEvenements.abonnePlusieurs(MesurePriseEnCompte, [
    consigneEvenementMesurePriseEnCompteDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourMesurePriseEnCompte,
  ]);

  busEvenements.abonnePlusieurs(ModuleTermine, [
    consigneEvenementModuleTerminéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourModuleTerminé,
  ]);

  busEvenements.abonnePlusieurs(BadgeCyberdépartDébloqué, [
    consigneBadgeCyberdépartDébloquéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourBadgeCyberdépartDébloqué,
  ]);

  busEvenements.abonnePlusieurs(ParcoursRejoint, [
    consigneParcoursRejointDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourParcoursRejoint,
  ]);

  busEvenements.abonnePlusieurs(ParcoursChangé, [
    consigneParcoursChangéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourParcoursChangé,
  ]);

  busEvenements.abonnePlusieurs(ParcoursAllégéTerminé, [
    consigneParcoursAllégéTerminéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourParcoursAllégéTerminé,
  ]);

  busEvenements.abonnePlusieurs(ParcoursCompletTerminé, [
    consigneParcoursCompletTerminéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourParcoursCompletTerminé,
  ]);

  busEvenements.abonnePlusieurs(RetourTestMaturitéDonné, [
    consigneRetourTestMaturitéDonné({ adaptateurJournal, adaptateurHorloge }),
    notifieUnRetourNégatifSurTestMaturité({ messagerieInstantanee }),
  ]);
};
