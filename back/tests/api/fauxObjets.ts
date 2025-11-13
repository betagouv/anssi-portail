import { join } from 'path';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { fabriqueMiddleware, Middleware } from '../../src/api/middleware';
import { AdaptateurOIDC } from '../../src/api/oidc/adaptateurOIDC';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';
import { adaptateurGestionVide } from '../../src/infra/adaptateurGestionErreurVide';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage';
import { adaptateurMonAideCyberVide } from '../../src/infra/adaptateurMonAideCyberVide';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { MessagerieInstantanee } from '../../src/metier/messagerieInstantanee';
import { fabriqueBusPourLesTests } from '../bus/busPourLesTests';
import { MockCmsCrisp } from '../mockCmsCrisp';
import { EntrepotFavoriMemoire } from '../persistance/entrepotFavoriMemoire';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire';
import { EntrepotGuideMemoire } from '../persistance/entrepotGuideMemoire';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import { EntrepotSessionDeGroupeMemoire } from '../persistance/EntrepotSessionDeGroupeMemoire';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';

export const fauxFournisseurDeChemin = {
  cheminPageJekyll: (_: string) =>
    join(process.cwd(), 'tests', 'ressources', 'factice.html'),
  cheminProduitJekyll: (_a: string, _b: string) =>
    join(process.cwd(), 'tests', 'ressources', 'factice.html'),
  ressourceDeBase: (_: string) =>
    join(process.cwd(), 'tests', 'ressources', 'factice.html'),
};

export const fauxAdaptateurOIDC: AdaptateurOIDC = {
  recupereInformationsUtilisateur: async (_accessToken: string) => ({
    email: '',
    nom: '',
    prenom: '',
    siret: '',
  }),
  recupereJeton: async (_requete) => ({ accessToken: '', idToken: '' }),
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

export const fauxAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise =
  {
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
      },
    ],
  };

export const fauxAdaptateurProfilAnssi: AdaptateurProfilAnssi = {
  metsAJour: async () => undefined,
  recupere: async () => undefined,
};

const entrepotUtilisateur = new EntrepotUtilisateurMemoire();

export const fauxAdaptateurEnvironnement: AdaptateurEnvironnement = {
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
    trustProxy: () => '',
    maxRequetesParMinute: () => 0,
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
  }),
  grist: () => ({
    urlFinancements: () =>
      'http://grist/api/docs/idDeMonDocument/tables/idDeMaTable/records',
    cleApiFinancements: () => 'FAUSSE_CLE_API',
    urlGuides: () =>
      'http://grist/api/docs/idDocumentGuides/tables/idTableGuides/records',
    cleApiGuides: () => 'FAUSSE_CLE_API_GUIDES',
  }),
};

const vraiMiddleware = fabriqueMiddleware({
  adaptateurJWT: fauxAdaptateurJWT,
  fournisseurChemin: fauxFournisseurDeChemin,
  adaptateurEnvironnement: fauxAdaptateurEnvironnement,
});

export const fauxMiddleware: Middleware = {
  ajouteMethodeNonce: vraiMiddleware.ajouteMethodeNonce,
  positionneLesCsp: () => async (_, __, suite) => {
    suite();
  },
  aseptise: () => async (_, __, suite) => {
    suite();
  },
  valide: () => async (_, __, suite) => {
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

const fausseMessagerieInstantanee: MessagerieInstantanee = {
  notifieUnRetourExperience: async () => {},
  notifieUnAvisUtilisateur: async () => {},
};

export const fauxAdaptateurHachage: AdaptateurHachage = {
  hache: (valeur: string): string => `${valeur}-hache`,
  hacheBCrypt: async (valeur: string): Promise<string> =>
    `${valeur}-hacheBCrypt`,
  compareBCrypt: async (
    _valeurEnClair: string,
    _empreinte: string
  ): Promise<boolean> => true,
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
  busEvenements: fabriqueBusPourLesTests(),
  cmsCrisp: new MockCmsCrisp(),
  entrepotFavori: new EntrepotFavoriMemoire(),
  entrepotFinancement: new EntrepotFinancementMemoire(),
  entrepotGuide: new EntrepotGuideMemoire(),
  entrepotResultatTest: new EntrepotResultatTestMemoire(),
  entrepotSessionDeGroupe: new EntrepotSessionDeGroupeMemoire(),
  entrepotUtilisateur,
  fournisseurChemin: fauxFournisseurDeChemin,
  generateurCodeSessionDeGroupe: fauxGenerateurCodeSessionDeGroupe,
  messagerieInstantanee: fausseMessagerieInstantanee,
  middleware: vraiMiddleware,
  reseau: {
    trustProxy: '0',
    maxRequetesParMinutes: 3,
    ipAutorisees: false,
  },
};
