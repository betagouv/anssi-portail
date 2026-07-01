import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../infra/adaptateurJournal.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { EntrepotFavori } from '../metier/entrepotFavori.js';
import { MessagerieInstantanee } from '../metier/messagerieInstantanee.js';
import { BusEvenements } from './busEvenements.js';
import {
  consigneCommentaireAvisMesureDonneDansMessagerie,
  consigneRetourAvisMesureDonneDansJournal,
} from './consigneAvisMesureDonneDansJournal.js';
import { consigneEvenementAvisUtilisateurDonneDansJournal } from './consigneEvenementAvisUtilisateurDonneDansJournal.js';
import { consigneBadgeCyberdépartDébloquéDansJournal } from './consigneBadgeCyberdepartDebloqueDansJournal.js';
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
import { creeContactBrevo } from './creeContactBrevo.js';
import { envoieEmailCreationCompte } from './envoieEmailCreationCompte.js';
import { AvisMesureDonne } from './evenements/avisMesureDonne.js';
import { AvisUtilisateurDonne } from './evenements/avisUtilisateurDonne.js';
import { BadgeCyberdépartDébloqué } from './evenements/badgeCyberdepartDebloque.js';
import { CompteCree } from './evenements/compteCree.js';
import { MesureConsultee } from './evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from './evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from './evenements/moduleTermine.js';
import { ProprieteTestRevendiquee } from './evenements/proprieteTestRevendiquee.js';
import { RetourExperienceDonne } from './evenements/retourExperienceDonne.js';
import { SimulationNis2Terminee } from './evenements/simulationNis2Terminee.js';
import { TestRealise } from './evenements/testRealise.js';
import { UtilisateurConnecte } from './evenements/utilisateurConnecte.js';
import { MiseAJourFavorisUtilisateur } from './miseAJourFavorisUtilisateur.js';

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
