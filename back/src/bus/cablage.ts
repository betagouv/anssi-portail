import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { EntrepotFavori } from '../metier/entrepotFavori.js';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { BusEvenements } from './busEvenements.js';
import { consigneRetourAvisMesureDonneDansJournal } from './consigneAvisMesureDonneDansJournal.js';
import { consigneAvisUtilisateurDonneDansJournal } from './consigneAvisUtilisateurDonneDansJournal.js';
import { consigneBadgeCyberdépartDébloquéDansJournal } from './consigneBadgeCyberdepartDebloqueDansJournal.js';
import { consigneCompteCreeDansJournal } from './consigneCompteCreeDansJournal.js';
import { consigneMAJFavorisUtilisateurDansJournal } from './consigneMAJFavorisUtilisateurDansJournal.js';
import { consigneMesureConsulteeDansJournal } from './consigneMesureConsulteeDansJournal.js';
import { consigneMesurePriseEnCompteDansJournal } from './consigneMesurePriseEnCompteDansJournal.js';
import { consigneModuleTerminéDansJournal } from './consigneModuleTerminéDansJournal.js';
import { consigneParcoursAllégéTerminéDansJournal } from './consigneParcoursAllegeTermineDansJournal.js';
import { consigneParcoursChangéDansJournal } from './consigneParcoursChangeDansJournal.js';
import { consigneParcoursCompletTerminéDansJournal } from './consigneParcoursCompletTermineDansJournal.js';
import { consigneParcoursRejointDansJournal } from './consigneParcoursRejointDansJournal.js';
import { consigneProprieteTestRevendiqueeDansJournal } from './consigneProprieteTestRevendiqueeDansJournal.js';
import { consigneQuestionnaireVraiFauxReponseSoumiseDansJournal } from './consigneQuestionnaireVraiFauxReponseSoumiseDansJournal.js';
import { consigneQuestionnaireVraiFauxTermineDansJournal } from './consigneQuestionnaireVraiFauxTermineDansJournal.js';
import { consigneRéflexesCyberReponseSoumiseDansJournal } from './consigneReflexesCyberReponseSoumiseDansJournal.js';
import { consigneRéflexesCyberTerminéDansJournal } from './consigneReflexesCyberReponseTermineDansJournal.js';
import { consigneRetourArticleDonnéDansJournal } from './consigneRetourArticleDonneDansJournal.js';
import { consigneRetourExperienceDonneDansJournal } from './consigneRetourExperienceDonneDansJournal.js';
import { consigneRetourMiniTestDonnéDansJournal } from './consigneRetourMiniTestDonneDansJournal.js';
import { consigneSimulationNis2TermineeDansJournal } from './consigneSimulationNis2TermineeDansJournal.js';
import { consigneTestExpositionRealiseDansJournal } from './consigneTestExpositionRealiseDansJournal.js';
import { consigneTestRealiseDansJournal } from './consigneTestRealiseDansJournal.js';
import { consigneUtilisateurConnecteDansJournal } from './consigneUtilisateurConnecteDansJournal.js';
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
import { QuestionnaireVraiFauxRéponseSoumise } from './evenements/questionnaireVraiFauxReponseSoumise.js';
import { QuestionnaireVraiFauxTerminé } from './evenements/questionnaireVraiFauxTermine.js';
import { RetourArticleDonné } from './evenements/retourArticleDonne.js';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne.js';
import { RetourMiniTestDonné } from './evenements/retourMiniTestDonne.js';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee.js';
import { SimulationRéflexesCyberRéponseSoumise } from './evenements/simulationReflexesCyberReponseSoumise.js';
import { SimulationRéflexesCyberTerminé } from './evenements/simulationReflexesCyberTermine.js';
import { TestExpositionRéalisé } from './evenements/TestExpositionRealise.js';
import { TestRealise } from './evenements/testRealise.js';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte.js';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur.js';
import { notifieCommentaireAvisMesureDonneDansMessagerie } from './notifieCommentaireAvisMesureDonneDansMessagerie.js';
import { notifieUnRetourNégatifSurArticle } from './notifieRetourNegatifSurArticle.js';
import { notifieUnRetourNégatifSurMiniTest } from './notifieRetourNegatifSurMiniTest.js';

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
    consigneTestRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );
  busEvenements.abonne(
    TestExpositionRéalisé,
    consigneTestExpositionRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );
  busEvenements.abonne(
    ProprieteTestRevendiquee,
    consigneProprieteTestRevendiqueeDansJournal({
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
    consigneCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    }),
  ]);
  busEvenements.abonne(
    MiseAJourFavorisUtilisateur,
    consigneMAJFavorisUtilisateurDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
      entrepotFavori,
    })
  );
  busEvenements.abonne(
    RetourExperienceDonne,
    consigneRetourExperienceDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );
  busEvenements.abonne(
    AvisUtilisateurDonne,
    consigneAvisUtilisateurDonneDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );

  busEvenements.abonne(
    UtilisateurConnecte,
    consigneUtilisateurConnecteDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );

  busEvenements.abonne(
    SimulationNis2Terminee,
    consigneSimulationNis2TermineeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })
  );

  busEvenements.abonnePlusieurs(MesureConsultee, [
    consigneMesureConsulteeDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourMesureConsultée,
  ]);

  busEvenements.abonnePlusieurs(AvisMesureDonne, [
    consigneRetourAvisMesureDonneDansJournal({ adaptateurJournal, adaptateurHorloge }),
    notifieCommentaireAvisMesureDonneDansMessagerie({ messagerieInstantanee }),
  ]);

  busEvenements.abonnePlusieurs(MesurePriseEnCompte, [
    consigneMesurePriseEnCompteDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
    adaptateurEmail.metsÀJourMesurePriseEnCompte,
  ]);

  busEvenements.abonnePlusieurs(ModuleTermine, [
    consigneModuleTerminéDansJournal({ adaptateurJournal, adaptateurHorloge, adaptateurHachage }),
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

  busEvenements.abonnePlusieurs(RetourMiniTestDonné, [
    consigneRetourMiniTestDonnéDansJournal({ adaptateurJournal, adaptateurHorloge }),
    notifieUnRetourNégatifSurMiniTest({ messagerieInstantanee }),
  ]);

  busEvenements.abonnePlusieurs(RetourArticleDonné, [
    consigneRetourArticleDonnéDansJournal({ adaptateurJournal, adaptateurHorloge }),
    notifieUnRetourNégatifSurArticle({ messagerieInstantanee }),
  ]);

  busEvenements.abonne(
    QuestionnaireVraiFauxRéponseSoumise,
    consigneQuestionnaireVraiFauxReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );

  busEvenements.abonne(
    QuestionnaireVraiFauxTerminé,
    consigneQuestionnaireVraiFauxTermineDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );

  busEvenements.abonne(
    SimulationRéflexesCyberRéponseSoumise,
    consigneRéflexesCyberReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );

  busEvenements.abonne(
    SimulationRéflexesCyberTerminé,
    consigneRéflexesCyberTerminéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })
  );
};
