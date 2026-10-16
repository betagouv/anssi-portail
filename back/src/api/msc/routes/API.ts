import { Express, RequestHandler } from 'express';
import { ressourceArticle } from '../../blog/ressourceArticle.js';
import { ressourceArticles } from '../../blog/ressourceArticles.js';
import { ressourceAvisArticle } from '../../blog/ressourceAvisArticle.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { ressourceFavori } from '../../favoris/ressourceFavori.js';
import { ressourceFavoris } from '../../favoris/ressourceFavoris.js';
import { ressourceFavorisPartages } from '../../favoris/ressourceFavorisPartages.js';
import { ressourceDocumentsGuide } from '../../guides/ressourceDocumentsGuide.js';
import { ressourceGuide } from '../../guides/ressourceGuide.js';
import { ressourceGuides } from '../../guides/ressourceGuides.js';
import { ressourceGuidesMemesCollections } from '../../guides/ressourceGuidesMemesCollections.js';
import { ressourceAvisMesure } from '../../mesures/ressourceAvisMesure.js';
import { ressourceMesure } from '../../mesures/ressourceMesure.js';
import { ressourceMesureCsv } from '../../mesures/ressourceMesureCsv.js';
import { ressourceModule } from '../../mesures/ressourceModule.js';
import { ressourceParcoursComplet } from '../../mesures/ressourceParcoursComplet.js';
import { ressourcePriseEnCompte } from '../../mesures/ressourcePriseEnCompte.js';
import { ressourceRécompensesCyberDépart } from '../../mesures/ressourceRecompensesCyberDepart/ressourceRecompensesCyberDepart.js';
import { ressourceRécompensesCyberDépartSansBadge } from '../../mesures/ressourceRecompensesCyberDepart/ressourceRecompensesCyberDepartSansBadge.js';
import { ressourceTestsExposition } from '../../mini-tests/exposition/ressourceTestsExposition.js';
import { ressourceRéponsesRéflexesCyber } from '../../mini-tests/reflexes-cyber/ressourceReponsesReflexesCyber.js';
import { ressourceInfoMiniTests } from '../../mini-tests/ressourceInfoMiniTests.js';
import { ressourceReactionMiniTest } from '../../mini-tests/ressourceReactionMiniTest.js';
import { ressourceRetourMiniTest } from '../../mini-tests/ressourceRetourMiniTest.js';
import { ressourceRéponsesVraiFaux } from '../../mini-tests/vrai-faux/ressourceReponsesVraiFaux.js';
import { ressourceVraiFaux } from '../../mini-tests/vrai-faux/ressourceVraiFaux.js';
import { ressourceDemandesAide } from '../../mon-aide-cyber/ressourceDemandesAide.js';
import { ressourceExigencesNis2 } from '../../nis2/ressourceExigencesNis2.js';
import { ressourceExigencesNis2Csv } from '../../nis2/ressourceExigencesNis2Csv.js';
import { ressourceSimulateurNis2 } from '../../nis2/ressourceSimulateurNis2.js';
import { ressourceModeleAnnuaireDeCrise } from '../../outils/ressourceModeleAnnuaireDeCrise.js';
import { ressourceRappelMiseAJourAnnuaireContacts } from '../../outils/ressourceRappelMiseAJourAnnuaireContacts.js';
import { ressourceRetoursSurOutil } from '../../outils/ressourceRetoursSurOutil.js';
import { ressourceAbonnementInfolettre } from '../../ressourceAbonnementInfolettre.js';
import { ressourceAnnuaireDepartements } from '../../ressourceAnnuaireDepartements.js';
import { ressourceAnnuaireOrganisations } from '../../ressourceAnnuaireOrganisations.js';
import { ressourceAnnuaireRegions } from '../../ressourceAnnuaireRegions.js';
import { ressourceAnnuaireSecteursActivite } from '../../ressourceAnnuaireSecteursActivite.js';
import { ressourceAnnuaireTranchesEffectif } from '../../ressourceAnnuaireTranchesEffectif.js';
import { ressourceAvisUtilisateur } from '../../ressourceAvisUtilisateur.js';
import { ressourceContacts } from '../../ressourceContacts.js';
import { ressourceFinancement } from '../../ressourceFinancement.js';
import { ressourceFinancements } from '../../ressourceFinancements.js';
import { ressourceInformationsCreationCompte } from '../../ressourceInformationsCreationCompte.js';
import { ressourceInfosSite } from '../../ressourceInfosSite.js';
import { ressourcePageCrisp } from '../../ressourcePageCrisp.js';
import { ressourceProfil } from '../../ressourceProfil.js';
import { ressourceRetoursExperience } from '../../ressourceRetoursExperience.js';
import { ressourceSanteGuides } from '../../ressourceSanteGuides.js';
import { ressourceStatistiques } from '../../ressourceStatistiques.js';
import { ressourceUtilisateurs } from '../../ressourceUtilisateurs.js';
import { ressourceDernierResultatDeTest } from '../../testMaturite/ressourceDernierResultatDeTest.js';
import { ressourceRepartitionDesResultatsDeTest } from '../../testMaturite/ressourceRepartitionDesResultatsDeTest.js';
import { ressourceResultatDeTest } from '../../testMaturite/ressourceResultatDeTest.js';
import { ressourceResultatsDeTest } from '../../testMaturite/ressourceResultatsDeTest.js';
import { ressourceResultatsSessionDeGroupe } from '../../testMaturite/ressourceResultatsSessionDeGroupe.js';
import { ressourceSessionDeGroupe } from '../../testMaturite/ressourceSessionDeGroupe.js';
import { ressourceSessionsDeGroupe } from '../../testMaturite/ressourceSessionsDeGroupe.js';
import { enregistreRouteDansExpress } from '../enregistreRoutes.js';

export const enregistreLesRoutesAPI = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/api${suffixe}`, ...gestionnaires);

  enregistreRoute('/profil', ressourceProfil(configurationServeur));

  enregistreRoute('/utilisateurs', ressourceUtilisateurs(configurationServeur));

  enregistreRoute('/mon-aide-cyber/demandes-aide', ressourceDemandesAide(configurationServeur));

  enregistreRoute('/favoris', ressourceFavoris(configurationServeur), ressourceFavori(configurationServeur));

  enregistreRoute('/favoris-partages', ressourceFavorisPartages(configurationServeur));

  enregistreRoute('/informations-creation-compte', ressourceInformationsCreationCompte(configurationServeur));

  enregistreRoute(
    '/resultats-test',
    ressourceResultatsDeTest(configurationServeur),
    ressourceResultatDeTest(configurationServeur)
  );
  enregistreRoute('/resultats-test/dernier', ressourceDernierResultatDeTest(configurationServeur));

  enregistreRoute(
    '/sessions-groupe',
    ressourceSessionsDeGroupe(configurationServeur),
    ressourceSessionDeGroupe(configurationServeur),
    ressourceResultatsSessionDeGroupe(configurationServeur)
  );

  enregistreRoute('/annuaire/organisations', ressourceAnnuaireOrganisations(configurationServeur));

  enregistreRoute('/annuaire/departements', ressourceAnnuaireDepartements(configurationServeur));

  enregistreRoute('/annuaire/regions', ressourceAnnuaireRegions(configurationServeur));

  enregistreRoute('/annuaire/secteurs-activite', ressourceAnnuaireSecteursActivite(configurationServeur));

  enregistreRoute('/annuaire/tranches-effectif', ressourceAnnuaireTranchesEffectif(configurationServeur));

  enregistreRoute('/pages-crisp', ressourcePageCrisp(configurationServeur));

  enregistreRoute('/infos-site', ressourceInfosSite(configurationServeur));

  enregistreRoute('/retours-experience', ressourceRetoursExperience(configurationServeur));

  enregistreRoute('/statistiques', ressourceStatistiques(configurationServeur));

  enregistreRoute('/repartition-resultats-test', ressourceRepartitionDesResultatsDeTest(configurationServeur));

  enregistreRoute('/avis-utilisateur', ressourceAvisUtilisateur(configurationServeur));

  enregistreRoute('/contacts', ressourceContacts(configurationServeur));

  enregistreRoute(
    '/financements',
    ressourceFinancements(configurationServeur),
    ressourceFinancement(configurationServeur)
  );

  enregistreRoute(
    '/guides',
    ressourceGuides(configurationServeur),
    ressourceGuide(configurationServeur),
    ressourceGuidesMemesCollections(configurationServeur),
    ressourceDocumentsGuide(configurationServeur)
  );

  enregistreRoute('/exigences-nis2', ressourceExigencesNis2(configurationServeur));
  enregistreRoute('/exigences-nis2.csv', ressourceExigencesNis2Csv(configurationServeur));

  enregistreRoute('/simulateur-nis2', ressourceSimulateurNis2(configurationServeur));

  enregistreRoute('/sante-guides', ressourceSanteGuides(configurationServeur));

  enregistreRoute('/abonnement-infolettre', ressourceAbonnementInfolettre(configurationServeur));

  enregistreRoute(
    '/cyberdepart/attestation_badge_cyberdepart.zip',
    ressourceRécompensesCyberDépart(configurationServeur)
  );

  enregistreRoute(
    '/cyberdepart/visuels_cyberdepart.zip',
    ressourceRécompensesCyberDépartSansBadge(configurationServeur)
  );

  enregistreRoute(
    '/mesures',
    ressourceMesure(configurationServeur),
    ressourceAvisMesure(configurationServeur),
    ressourcePriseEnCompte(configurationServeur)
  );
  enregistreRoute('/parcours/complet', ressourceParcoursComplet(configurationServeur));

  enregistreRoute('/reactions-mini-tests', ressourceReactionMiniTest(configurationServeur));
  enregistreRoute('/info-mini-tests', ressourceInfoMiniTests(configurationServeur));
  enregistreRoute('/mini-tests/vrai-faux', ressourceVraiFaux(configurationServeur));
  enregistreRoute('/mini-tests/vrai-faux/reponses', ressourceRéponsesVraiFaux(configurationServeur));
  enregistreRoute('/mini-tests/reflexes-cyber/reponses', ressourceRéponsesRéflexesCyber(configurationServeur));
  enregistreRoute('/mini-tests/exposition/tests', ressourceTestsExposition(configurationServeur));
  enregistreRoute(
    '/articles',
    ressourceArticles(configurationServeur),
    ressourceArticle(configurationServeur),
    ressourceAvisArticle(configurationServeur)
  );

  enregistreRoute('/mesures.csv', ressourceMesureCsv(configurationServeur));
  enregistreRoute('/modules', ressourceModule(configurationServeur));

  enregistreRoute('/retour-mini-tests', ressourceRetourMiniTest(configurationServeur));

  enregistreRoute('/outils/modele-annuaire-de-crise.xlsx', ressourceModeleAnnuaireDeCrise(configurationServeur));
  enregistreRoute('/outils/retours', ressourceRetoursSurOutil(configurationServeur));
  enregistreRoute(
    '/outils/rappel-mise-a-jour-annuaire-contacts.ics',
    ressourceRappelMiseAJourAnnuaireContacts(configurationServeur)
  );
};
