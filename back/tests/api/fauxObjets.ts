import { join } from 'path';
import { AdaptateurOIDC } from '../../src/api/oidc/adaptateurOIDC';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { fabriqueMiddleware } from '../../src/api/middleware';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { fabriqueBusPourLesTests } from '../bus/busPourLesTests';
import { AdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise';
import { adaptateurGestionVide } from '../../src/infra/adaptateurGestionErreurVide';

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
  genereToken: (_: Record<string, any>) => '',
  decode: (_: string) => ({}),
};

export const fauxAdaptateurRechercheEntreprise: AdaptateurRechercheEntreprise =
  {
    rechercheOrganisations: async (_: string, __: string | null) => [],
  };

export const configurationDeTestDuServeur: ConfigurationServeur = {
  fournisseurChemin: fauxFournisseurDeChemin,
  middleware: fabriqueMiddleware(),
  adaptateurOIDC: fauxAdaptateurOIDC,
  adaptateurJWT: fauxAdaptateurJWT,
  adaptateurGestionErreur: adaptateurGestionVide,
  entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
  trustProxy: '0',
  maxRequetesParMinutes: 3,
  busEvenements: fabriqueBusPourLesTests(),
  adaptateurRechercheEntreprise: fauxAdaptateurRechercheEntreprise,
};
