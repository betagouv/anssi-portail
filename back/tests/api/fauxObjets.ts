import { join } from 'path';
import { AdaptateurOIDC } from '../../src/api/oidc/adaptateurOIDC';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { fabriqueMiddleware, Middleware } from '../../src/api/middleware';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { fabriqueBusPourLesTests } from '../bus/busPourLesTests';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { adaptateurGestionVide } from '../../src/infra/adaptateurGestionErreurVide';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import { AdaptateurProfilAnssi } from '../../src/infra/adaptateurProfilAnssi';
import { EntrepotFavoriMemoire } from '../persistance/entrepotFavoriMemoire';
import { MockCmsCrisp } from '../mockCmsCrisp';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';
import { EntrepotSessionDeGroupeMemoire } from '../persistance/EntrepotSessionDeGroupeMemoire';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage';
import { MessagerieInstantanee } from '../../src/metier/messagerieInstantanee';

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
      { siret, nom: '', departement: '86' },
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

const fauxAdaptateurMonAideCyber = { creeDemandeAide: () => Promise.resolve() };

const fauxGenerateurCodeSessionDeGroupe = {
  genere: async () => 'hello',
};

const fausseMessagerieInstantanee: MessagerieInstantanee = {
  notifieUnRetourExperience: async () => {},
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
  fournisseurChemin: fauxFournisseurDeChemin,
  middleware: vraiMiddleware,
  adaptateurOIDC: fauxAdaptateurOIDC,
  adaptateurJWT: fauxAdaptateurJWT,
  adaptateurGestionErreur: adaptateurGestionVide,
  entrepotUtilisateur,
  reseau: {
    trustProxy: '0',
    maxRequetesParMinutes: 3,
    ipAutorisees: false,
  },
  busEvenements: fabriqueBusPourLesTests(),
  adaptateurRechercheEntreprise: fauxAdaptateurRechercheEntreprise,
  entrepotResultatTest: new EntrepotResultatTestMemoire(),
  adaptateurProfilAnssi: fauxAdaptateurProfilAnssi,
  adaptateurMonAideCyber: fauxAdaptateurMonAideCyber,
  entrepotFavori: new EntrepotFavoriMemoire(),
  entrepotSessionDeGroupe: new EntrepotSessionDeGroupeMemoire(),
  cmsCrisp: new MockCmsCrisp(),
  adaptateurEnvironnement: fauxAdaptateurEnvironnement,
  generateurCodeSessionDeGroupe: fauxGenerateurCodeSessionDeGroupe,
  adaptateurHachage: fauxAdaptateurHachage,
  messagerieInstantanee: fausseMessagerieInstantanee,
};
