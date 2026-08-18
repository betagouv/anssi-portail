import { Request } from 'express';
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildEndSessionUrl,
  discovery,
  fetchUserInfo,
  randomNonce,
  randomState,
} from 'openid-client';
import { adaptateurEnvironnement } from '../../infra/adaptateurEnvironnement.js';

export interface DemandeAutorisation {
  url: string;
  nonce: string;
  state: string;
}

type InformationsUtilisateur = {
  prenom: string;
  nom: string;
  email: string;
  siret: string | undefined;
};

type JetonsOIDC = {
  idToken: string;
  accessToken: string;
  sujet: string;
  connexionAvecMFA: boolean;
};

export interface AdaptateurOIDC {
  genereDemandeAutorisation: () => Promise<DemandeAutorisation>;
  recupereJeton: (requete: Request) => Promise<JetonsOIDC>;
  recupereInformationsUtilisateur: (accessToken: string, sujet: string) => Promise<InformationsUtilisateur>;
  genereDemandeDeconnexion: (idToken: string) => Promise<{ url: string; state: string }>;
}

const configurationOidc = adaptateurEnvironnement.oidc();

async function recupereClient() {
  return discovery(new URL(configurationOidc.urlBase()), configurationOidc.clientId(), {
    client_secret: configurationOidc.clientSecret(),
    redirect_uris: [configurationOidc.urlRedirectionApresAuthentification()],
    response_types: ['code'],
    id_token_signed_response_alg: 'RS256',
    userinfo_signed_response_alg: 'RS256',
  });
}

const genereDemandeAutorisation = async () => {
  const client = await recupereClient();
  const nonce = randomNonce();
  const state = randomState();
  const url = buildAuthorizationUrl(client, {
    redirect_uri: configurationOidc.urlRedirectionApresAuthentification(),
    scope: 'openid email given_name usual_name siret',
    nonce,
    state,
    // https://partenaires.proconnect.gouv.fr/docs/fournisseur-service/niveaux-acr#les-m%C3%A9thodes-dauthentifications
    claims: JSON.stringify({ id_token: { amr: null } }),
  });

  return {
    url: url.href,
    nonce,
    state,
  };
};

const genereDemandeDeconnexion = async (idToken: string) => {
  const state = randomState();
  const client = await recupereClient();
  const url = buildEndSessionUrl(client, {
    post_logout_redirect_uri: configurationOidc.urlRedirectionApresDeconnexion(),
    id_token_hint: idToken,
    state,
  });

  return {
    url: url.href,
    state,
  };
};

const recupereJeton = async (requete: Request) => {
  const client = await recupereClient();
  const { nonce, state } = requete.cookies.AgentConnectInfo;
  const callbackUrl = new URL(configurationOidc.urlRedirectionApresAuthentification());
  callbackUrl.search = new URL(requete.originalUrl, callbackUrl).search;
  const token = await authorizationCodeGrant(client, callbackUrl, {
    expectedNonce: nonce,
    expectedState: state,
    idTokenExpected: true,
  });

  if (!token.id_token || !token.access_token) {
    throw new Error("Les tokens n'ont pas pu être récupérés");
  }

  const claims = token.claims();
  if (!claims) {
    throw new Error("Les claims du token d'identité n'ont pas pu être récupérés");
  }

  const amr = claims.amr;

  return {
    idToken: token.id_token,
    accessToken: token.access_token,
    sujet: claims.sub,
    connexionAvecMFA:
      Array.isArray(amr) &&
      amr
        .filter((methodeAuthent): methodeAuthent is string => typeof methodeAuthent === 'string')
        .map((methodeAuthent) => methodeAuthent.trim())
        .includes('mfa'),
  };
};

const recupereInformationsUtilisateur = async (accessToken: string, sujet: string) => {
  const client = await recupereClient();
  const { given_name: prenom, usual_name: nom, email, siret } = await fetchUserInfo(client, accessToken, sujet);
  return { prenom, nom, email, siret } as InformationsUtilisateur;
};

const adaptateurOIDC: AdaptateurOIDC = {
  genereDemandeAutorisation,
  genereDemandeDeconnexion,
  recupereInformationsUtilisateur,
  recupereJeton,
};
export { adaptateurOIDC };
