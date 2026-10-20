import { Express, RequestHandler } from 'express';
import { ressourceArticle } from '../../../blog/ressourceArticle.js';
import { ressourceArticles } from '../../../blog/ressourceArticles.js';
import { ressourceAvisArticle } from '../../../blog/ressourceAvisArticle.js';
import { ConfigurationServeur } from '../../../configurationServeur.js';
import { ressourceFavori } from '../../../favoris/ressourceFavori.js';
import { ressourceFavoris } from '../../../favoris/ressourceFavoris.js';
import { ressourceFavorisPartages } from '../../../favoris/ressourceFavorisPartages.js';
import { ressourceDocumentsGuide } from '../../../guides/ressourceDocumentsGuide.js';
import { ressourceGuide } from '../../../guides/ressourceGuide.js';
import { ressourceGuides } from '../../../guides/ressourceGuides.js';
import { ressourceGuidesMemesCollections } from '../../../guides/ressourceGuidesMemesCollections.js';
import { ressourceAvisMesure } from '../../../mesures/ressourceAvisMesure.js';
import { ressourceMesure } from '../../../mesures/ressourceMesure.js';
import { ressourceMesureCsv } from '../../../mesures/ressourceMesureCsv.js';
import { ressourceModule } from '../../../mesures/ressourceModule.js';
import { ressourceParcoursComplet } from '../../../mesures/ressourceParcoursComplet.js';
import { ressourcePriseEnCompte } from '../../../mesures/ressourcePriseEnCompte.js';
import { ressourceRécompensesCyberDépart } from '../../../mesures/ressourceRecompensesCyberDepart/ressourceRecompensesCyberDepart.js';
import { ressourceRécompensesCyberDépartSansBadge } from '../../../mesures/ressourceRecompensesCyberDepart/ressourceRecompensesCyberDepartSansBadge.js';
import { ressourceDemandesAide } from '../../../mon-aide-cyber/ressourceDemandesAide.js';
import { ressourceExigencesNis2 } from '../../../nis2/ressourceExigencesNis2.js';
import { ressourceExigencesNis2Csv } from '../../../nis2/ressourceExigencesNis2Csv.js';
import { ressourceSimulateurNis2 } from '../../../nis2/ressourceSimulateurNis2.js';
import { ressourceAbonnementInfolettre } from '../../../ressourceAbonnementInfolettre.js';
import { ressourceAvisUtilisateur } from '../../../ressourceAvisUtilisateur.js';
import { ressourceContacts } from '../../../ressourceContacts.js';
import { ressourceFinancement } from '../../../ressourceFinancement.js';
import { ressourceFinancements } from '../../../ressourceFinancements.js';
import { ressourceInformationsCreationCompte } from '../../../ressourceInformationsCreationCompte.js';
import { ressourceInfosSite } from '../../../ressourceInfosSite.js';
import { ressourcePageCrisp } from '../../../ressourcePageCrisp.js';
import { ressourceProfil } from '../../../ressourceProfil.js';
import { ressourceRetoursExperience } from '../../../ressourceRetoursExperience.js';
import { ressourceSanteGuides } from '../../../ressourceSanteGuides.js';
import { ressourceStatistiques } from '../../../ressourceStatistiques.js';
import { ressourceUtilisateurs } from '../../../ressourceUtilisateurs.js';
import { ressourceDernierResultatDeTest } from '../../../testMaturite/ressourceDernierResultatDeTest.js';
import { ressourceRepartitionDesResultatsDeTest } from '../../../testMaturite/ressourceRepartitionDesResultatsDeTest.js';
import { ressourceResultatDeTest } from '../../../testMaturite/ressourceResultatDeTest.js';
import { ressourceResultatsDeTest } from '../../../testMaturite/ressourceResultatsDeTest.js';
import { ressourceResultatsSessionDeGroupe } from '../../../testMaturite/ressourceResultatsSessionDeGroupe.js';
import { ressourceSessionDeGroupe } from '../../../testMaturite/ressourceSessionDeGroupe.js';
import { ressourceSessionsDeGroupe } from '../../../testMaturite/ressourceSessionsDeGroupe.js';
import { enregistreRouteDansExpress } from '../../enregistreRoutes.js';
import { enregistreLesAnnuaires } from './annuaire.js';
import { enregistreLesMiniTests } from './miniTests.js';
import { enregistreLesOutils } from './outils.js';

export const enregistreLesRoutesAPI = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = (suffixe: string, ...gestionnaires: RequestHandler[]) =>
    enregistreRouteDansExpress(app)(`/api${suffixe}`, ...gestionnaires);

  enregistreLesOutils(app, configurationServeur);
  enregistreLesAnnuaires(app, configurationServeur);
  enregistreLesMiniTests(app, configurationServeur);

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

  enregistreRoute(
    '/articles',
    ressourceArticles(configurationServeur),
    ressourceArticle(configurationServeur),
    ressourceAvisArticle(configurationServeur)
  );

  enregistreRoute('/mesures.csv', ressourceMesureCsv(configurationServeur));
  enregistreRoute('/modules', ressourceModule(configurationServeur));
};
