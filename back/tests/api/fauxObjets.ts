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
      { siret, nom: '', departement: '' },
    ],
  };

export const fauxAdaptateurProfilAnssi: AdaptateurProfilAnssi = {
  metsAJour: async () => undefined,
  recupere: async () => undefined,
};

export const fauxMiddleware: Middleware = {
  ajouteMethodeNonce: fabriqueMiddleware({
    adaptateurJWT: fauxAdaptateurJWT,
    fournisseurChemin: fauxFournisseurDeChemin,
  }).ajouteMethodeNonce,
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
};

const fauxAdaptateurMonAideCyber = { creeDemandeAide: () => Promise.resolve() };

export const fauxAdaptateurEnvironnement: AdaptateurEnvironnement = {
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
};

export const configurationDeTestDuServeur: ConfigurationServeur = {
  fournisseurChemin: fauxFournisseurDeChemin,
  middleware: fabriqueMiddleware({
    adaptateurJWT: fauxAdaptateurJWT,
    fournisseurChemin: fauxFournisseurDeChemin,
  }),
  adaptateurOIDC: fauxAdaptateurOIDC,
  adaptateurJWT: fauxAdaptateurJWT,
  adaptateurGestionErreur: adaptateurGestionVide,
  entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
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
};
