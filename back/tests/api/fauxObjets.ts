import { join } from 'path';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT.js';
import { ConfigurationServeur } from '../../src/api/configurationServeur.js';
import { FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { ServiceRécompensesCyberDépart } from '../../src/api/mesures/ressourceRecompensesCyberDepart/serviceRecompensesCyberDepart.js';
import {
  fabriqueMiddleware,
  GestionnaireRequêtesComplémentaires,
  Middleware,
} from '../../src/api/middlewares/middleware.js';
import { AdaptateurOIDC } from '../../src/api/oidc/adaptateurOIDC.js';
import { AdaptateurCellar } from '../../src/infra/adaptateurCellar.js';
import { adaptateurCompression } from '../../src/infra/adaptateurCompression.js';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';
import { adaptateurGestionVide } from '../../src/infra/adaptateurGestionErreurVide.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { adaptateurMonAideCyberVide } from '../../src/infra/adaptateurMonAideCyberVide.js';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi.js';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { AdaptateurEnrichissement } from '../../src/infra/enrichissement/adaptateurEnrichissement.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
import { MessagerieInstantanee } from '../../src/metier/messagerieInstantanee.js';
import { Parcours } from '../../src/metier/parcours.js';
import { fabriqueBusPourLesTests } from '../bus/busPourLesTests.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';
import { EntrepotExigenceMemoire } from '../persistance/entrepotExigenceMemoire.js';
import { EntrepotFavoriMemoire } from '../persistance/entrepotFavoriMemoire.js';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire.js';
import { EntrepotGuideMemoire } from '../persistance/entrepotGuideMemoire.js';
import { EntrepotGuideTravailMemoire } from '../persistance/entrepotGuideTravailMemoire.js';
import { EntrepotMesureMemoire } from '../persistance/entrepotMesureMemoire.js';
import { EntrepotPriseEnCompteMemoire } from '../persistance/EntrepotPriseEnCompteMemoire.js';
import { EntrepotReactionMiniTestMemoire } from '../persistance/entrepotReactionMiniTestMemoire.js';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire.js';
import { EntrepotSessionDeGroupeMemoire } from '../persistance/EntrepotSessionDeGroupeMemoire.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { EntrepôtModuleMémoire } from '../persistance/EntrepôtModuleMémoire.js';
import { EntrepôtQuestionVraieFausseMémoire } from '../persistance/entrepotQuestionVraieFausseMemoire.js';
import { AdaptateurStatistiqueMiniTestsMémoire } from '../../src/infra/adaptateurStatistiqueMiniTestsMémoire.js';

export const ressourceFactice = (): string => join(process.cwd(), 'tests', 'ressources', 'factice.html');
export const typstFactice = (): string => join(process.cwd(), 'tests', 'ressources', 'factice.typ');
export const fauxFournisseurDeChemin: FournisseurChemin = {
  front: {
    sitemapXml: () => '',
    police: (nomDePolice: string) => join(process.cwd(), '..', 'front', 'assets', 'fonts', nomDePolice),
  },
  back: {
    csvNis2Simulateur: () =>
      join(process.cwd(), 'src', 'metier', 'nis2-simulateur', 'questionnaire', 'specifications-completes.csv'),
    attestationTypCyberdepart: () =>
      join(process.cwd(), 'src', 'api', 'mesures', 'ressourceRecompensesCyberDepart', 'attestation', 'attestation.typ'),
    badgePngRécompenseCyberdepart: () =>
      join(process.cwd(), 'src', 'api', 'mesures', 'ressourceRecompensesCyberDepart', 'badge.png'),
    banniereSvgRécompenseCyberdepart: () =>
      join(process.cwd(), 'src', 'api', 'mesures', 'ressourceRecompensesCyberDepart', 'banniere.svg'),
  },
  jekyll: {
    page404: () => ressourceFactice(),
    pageMaintenance: () => ressourceFactice(),
    robotsTxt: () => ressourceFactice(),
    page: (_nom: string) => ressourceFactice(),
    ressource: (_nom: string) => ressourceFactice(),
    contact: (_nom: string) => ressourceFactice(),
    service: (_nom: string) => ressourceFactice(),
    composantSvelteCompilé: (_nom: string) => ressourceFactice(),

    assets: () => ressourceFactice(),
    scripts: () => ressourceFactice(),
    libSvelte: () => ressourceFactice(),
    favicon: () => ressourceFactice(),
  },
};

export const fauxAdaptateurOIDC: AdaptateurOIDC = {
  recupereInformationsUtilisateur: async (_accessToken: string) => ({
    email: '',
    nom: '',
    prenom: '',
    siret: '',
  }),
  recupereJeton: async (_requete) => ({
    accessToken: '',
    idToken: '',
    sujet: '',
    connexionAvecMFA: false,
  }),
  genereDemandeAutorisation: async () => ({
    url: '',
    nonce: '',
    state: '',
  }),
  genereDemandeDeconnexion: async (_) => ({ url: '', state: '' }),
};

export const fauxAdaptateurJWT: AdaptateurJWT = {
  genereToken: (_: Record<string, unknown>) => '',
  decode: (_: string) => ({}),
};

export const fauxAdaptateurEnrichissement: AdaptateurEnrichissement = {
  enrichisAvecComposants: async (contenuPage) => contenuPage,
};

export const fauxAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
  rechercheOrganisations: async (siret: string, __: string | null) => [
    {
      siret,
      nom: '',
      departement: '86',
      codeSecteur: 'A',
      codeRegion: 'FR-971',
      codeTrancheEffectif: '11',
      estAssociation: false,
      estCollectivite: false,
      codeActivite: '84.11Z',
    },
  ],
};

export const fauxAdaptateurProfilAnssi: AdaptateurProfilAnssi = {
  metsAJour: async () => undefined,
  recupere: async () => undefined,
  recherche: async () => [],
};

const entrepotUtilisateur = new EntrepotUtilisateurMemoire();

const CINQ_MINUTES = 300;

export const fauxAdaptateurEnvironnement: AdaptateurEnvironnement = {
  versionDeConstruction: () => '',
  chiffrement: () => ({
    cleChaCha20Hex: () => 'uneCléCha20Hex',
  }),
  hachage: () => ({
    tousLesSecretsDeHachage: () => [{ version: 1, secret: 'secret' }],
  }),
  urlBaseMSC: () => 'http://localhost',
  oidc: () => ({
    urlRedirectionApresAuthentification: () => '',
    urlRedirectionApresDeconnexion: () => '',
    urlBase: () => '',
    clientId: () => '',
    clientSecret: () => '',
  }),
  serveur: () => ({
    trustProxy: () => 0,
    maxRequetesParMinute: () => 0,
    maxRequetesParMinuteAPI: () => 200,
    ipAutorisees: () => false,
  }),
  sentry: () => ({
    dsn: () => '',
    environnement: () => '',
  }),
  crisp: () => ({
    idArticle: (_: string) => '',
  }),
  maintenance: () => ({
    actif: () => false,
    detailsPreparation: () => undefined,
  }),
  repartition: () => ({
    nombreMinimumDeResultats: () => 2,
  }),
  mattermost: () => ({
    webhookAvisUtilisateur: () => '',
    webhookRetourExperience: () => '',
    webhookAvisMesure: () => '',
  }),
  grist: () => ({
    baseURL: () => 'http://grist',
    financement: () => ({
      urlTable: () => 'http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records',
      cleApi: () => 'FAUSSE_CLE_API',
    }),
    gestionGuides: () => ({
      urlTable: () => 'http://grist/api/docs/idDocumentGuidesTravail/tables/idTableGuidesTravail/records',
      cleApi: () => 'FAUSSE_CLE_API_GUIDES_TRAVAIL',
    }),
    guides: () => ({
      urlTable: () => 'http://grist/api/docs/idDocumentGuides/tables/idTableGuides/records',
      cleApi: () => 'FAUSSE_CLE_API_GUIDES',
    }),
    nis2: () => ({
      idDocument: () => 'idDeDocumentSocle',
      cleApi: () => 'FAUSSE_CLE_API_SOCLE',
    }),
    dureeCacheEnSecondes: () => CINQ_MINUTES,
  }),
  urlCellar: () => ({
    guides: () => 'https://guides.notre-cellar/',
    ressourcesCyber: () => 'https://ressources-cyber.notre-cellar/',
    visas: () => 'https://visas.notre-cellar/',
  }),
  cellar: () => ({
    region: () => '',
    url: () => 'https://notre-cellar/',
    gestionGuides: () => ({
      nomDuBucket: () => 'gestion-guides',
    }),
  }),
  matomo: () => ({
    idSite: () => '227',
  }),
  monAideCyber: () => ({
    url: () => 'https://demo.monaidecyber.fr',
    dureeCacheStatistiquesEnSecondes: () => 300,
  }),
  fonctionnalites: () => ({
    nis2: () => ({
      afficheCyFun23: () => true,
      afficheSimulateur: () => false,
    }),
    parcoursDeSecurisation: () => ({
      estActif: () => true,
    }),
  }),
  nodeEnv: () => 'developpement',
  rechercheEntreprise: () => ({
    apiUrl: () => 'http://recherche-entreprise',
  }),
  siret: () => ({
    desactiveValidationStricte: () => false,
  }),
  secrets: () => ({
    jwt: () => 'FAUX_SECRET_JWT',
    cookie: () => 'FAUX_SECRET_COOKIE',
  }),
  brevo: () => ({
    cléAPI: () => 'FAUSSE_CLE_API_BREVO',
    url: () => 'FAUSSE_URL_BREVO',
  }),
  journal: () => ({
    baseDeDonnéesActive: () => false,
  }),
};

const vraiMiddleware = fabriqueMiddleware({
  adaptateurJWT: fauxAdaptateurJWT,
  fournisseurChemin: fauxFournisseurDeChemin,
  adaptateurEnvironnement: fauxAdaptateurEnvironnement,
  adaptateurEnrichissement: fauxAdaptateurEnrichissement,
});

export const fauxMiddleware: Middleware = {
  ajouteMethodeEnrichissement: vraiMiddleware.ajouteMethodeEnrichissement,
  positionneLesCsp: () => async (_, __, suite) => {
    suite();
  },
  interdisLaMiseEnCache: async (_, __, suite) => {
    suite();
  },
  verifieJWT: async (_, __, suite) => {
    suite();
  },
  verifieJWTNavigation: async (_, __, suite) => {
    suite();
  },
  ajouteUtilisateurARequete: (_, __) => async (_, __, suite) => suite(),
  verifieModeMaintenance: async (_, __, suite) => suite(),
};

const fauxAdaptateurMonAideCyber = adaptateurMonAideCyberVide();

const fauxGenerateurCodeSessionDeGroupe = {
  genere: async () => 'hello',
};

export const fausseMessagerieInstantanee: MessagerieInstantanee = {
  notifieUnRetourExperience: async () => {},
  notifieUnAvisUtilisateur: async () => {},
  notifieUnAvisNegatifSurUneMesure: async () => {},
  notifieUnRetourNégatifSurTestMaturité: async () => {},
};

export const fauxAdaptateurHachage: AdaptateurHachage = {
  hache: (valeur: string): string => `${valeur}-hache`,
  hacheBCrypt: async (valeur: string): Promise<string> => `${valeur}-hacheBCrypt`,
  compareBCrypt: async (_valeurEnClair: string, _empreinte: string): Promise<boolean> => true,
  hacheAvecUnSeulSecret: (valeur: string, secret: string): string => `${valeur}-${secret}-hache`,
};

export const fauxAdaptateurCellar: AdaptateurCellar = {
  existe: async () => true,
  get: async () => undefined,
  getStream: async () => undefined,
  depose: async () => undefined,
  supprime: async () => undefined,
};

export const fauxAdaptateurEmail: AdaptateurEmail = {
  envoieEmailBienvenue: async () => {},
  inscrisAInfolettre: async () => {},
  creeContactBrevo: async () => {},
  metsÀJourMesureConsultée: async () => {},
  metsÀJourMesurePriseEnCompte: async () => {},
  metsÀJourModuleTerminé: async () => {},
  metsÀJourBadgeCyberdépartDébloqué: async () => {},
  metsÀJourParcoursChangé: async () => {},
  metsÀJourParcoursRejoint: async () => {},
  metsÀJourParcoursAllégéTerminé: async () => {},
  metsÀJourParcoursCompletTerminé: async () => {},
};

export const fauxGestionnaireRequêtesComplémentaires: GestionnaireRequêtesComplémentaires = {
  attributionParcours: (_parcours: Parcours) => async (_requête, _réponse, suite) => {
    suite();
  },
  attributionParcoursMesure: async (_requête, _réponse, suite) => {
    suite();
  },
  publieMesureConsultée: async (_requête, _réponse, suite) => {
    suite();
  },
};
export const configurationDeTestDuServeur: ConfigurationServeur = {
  adaptateurEnvironnement: fauxAdaptateurEnvironnement,
  adaptateurGestionErreur: adaptateurGestionVide,
  adaptateurHachage: fauxAdaptateurHachage,
  adaptateurJWT: fauxAdaptateurJWT,
  adaptateurMonAideCyber: fauxAdaptateurMonAideCyber,
  adaptateurOIDC: fauxAdaptateurOIDC,
  adaptateurProfilAnssi: fauxAdaptateurProfilAnssi,
  adaptateurRechercheEntreprise: fauxAdaptateurRechercheEntreprise,
  adaptateurStatistiqueMiniTests: new AdaptateurStatistiqueMiniTestsMémoire(),
  busEvenements: fabriqueBusPourLesTests(),
  cmsCrisp: new MockCmsCrisp(),
  entrepotFavori: new EntrepotFavoriMemoire(),
  entrepotFinancement: new EntrepotFinancementMemoire(),
  entrepotGuide: new EntrepotGuideMemoire(),
  entrepotGuideTravail: new EntrepotGuideTravailMemoire(),
  entrepotResultatTest: new EntrepotResultatTestMemoire(),
  entrepotSessionDeGroupe: new EntrepotSessionDeGroupeMemoire(),
  entrepotExigence: new EntrepotExigenceMemoire(),
  entrepotMesure: new EntrepotMesureMemoire(),
  entrepotPriseEnCompte: new EntrepotPriseEnCompteMemoire(),
  entrepotReactionMiniTest: new EntrepotReactionMiniTestMemoire(),
  entrepôtModule: new EntrepôtModuleMémoire(),
  entrepôtQuestionVraieFausse: new EntrepôtQuestionVraieFausseMémoire(),
  serviceRécompensesCyberDépart: new ServiceRécompensesCyberDépart(fauxFournisseurDeChemin),
  entrepotUtilisateur,
  fournisseurChemin: fauxFournisseurDeChemin,
  generateurCodeSessionDeGroupe: fauxGenerateurCodeSessionDeGroupe,
  messagerieInstantanee: fausseMessagerieInstantanee,
  middleware: vraiMiddleware,
  reseau: {
    trustProxy: 0,
    maxRequetesParMinutes: 10,
    maxRequetesParMinuteAPI: 10,
    ipAutorisees: false,
  },
  cellar: fauxAdaptateurCellar,
  serviceSanteGuides: {
    calculeSante: async () => ({
      guidesEnBonneSante: [],
      guidesAvecProbleme: [],
    }),
  },
  adaptateurEmail: fauxAdaptateurEmail,
  generateurImage: {
    depuisPdf: async (pdfOriginal) => {
      return pdfOriginal;
    },
  },
  adaptateurCompression,
  gestionnairesRequêtesComplémentaires: fauxGestionnaireRequêtesComplémentaires,
};
