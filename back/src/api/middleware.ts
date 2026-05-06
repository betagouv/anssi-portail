import { HttpStatusCode } from 'axios';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import helmet from 'helmet';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import { AdaptateurEnvironnement } from '../infra/adaptateurEnvironnement';
import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { Utilisateur } from '../metier/utilisateur';
import { AdaptateurJWT } from './adaptateurJWT';
import { FournisseurChemin } from './fournisseurChemin';

type FonctionMiddleware = (requete: Request, reponse: Response, suite: NextFunction) => Promise<void>;

export type Middleware = {
  interdisLaMiseEnCache: FonctionMiddleware;
  verifieJWT: FonctionMiddleware;
  verifieJWTNavigation: FonctionMiddleware;
  ajouteMethodeEnrichissement: FonctionMiddleware;
  positionneLesCsp: () => FonctionMiddleware;
  ajouteUtilisateurARequete: (
    entrepotUtilisateur: EntrepotUtilisateur,
    adaptateurHachage: AdaptateurHachage
  ) => FonctionMiddleware;
  verifieModeMaintenance: FonctionMiddleware;
};

export const fabriqueMiddleware = ({
  adaptateurJWT,
  fournisseurChemin,
  adaptateurEnvironnement,
}: {
  adaptateurJWT: AdaptateurJWT;
  fournisseurChemin: FournisseurChemin;
  adaptateurEnvironnement: AdaptateurEnvironnement;
}): Middleware => {
  const interdisLaMiseEnCache = async (_requete: Request, reponse: Response, suite: NextFunction) => {
    reponse.set({
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'surrogate-control': 'no-store',
    });
    suite();
  };

  const verifieJWT = async (
    requete: Request & { emailUtilisateurCourant?: string },
    reponse: Response,
    suite: NextFunction
  ) => {
    if (!requete.session?.token) {
      reponse.sendStatus(401);
      return;
    }

    try {
      const { email } = adaptateurJWT.decode(requete.session.token);
      requete.emailUtilisateurCourant = email;
      suite();
    } catch {
      reponse.sendStatus(401);
    }
  };

  const verifieJWTNavigation = async (requete: Request, reponse: Response, suite: NextFunction) => {
    if (!requete.session?.token) {
      reponse.redirect('/connexion');
      return;
    }

    try {
      adaptateurJWT.decode(requete.session.token);
      suite();
    } catch {
      reponse.redirect('/connexion');
    }
  };

  const ajouteMethodeEnrichissement = async (_: Request, reponse: Response, suite: NextFunction) => {
    const nonceAleatoire = randomBytes(16).toString('base64');
    reponse.locals.nonce = nonceAleatoire;
    reponse.envoieFichierEnrichi = (chemin: string) => {
      try {
        const fichier = fs.readFileSync(chemin, 'utf-8');
        const avecNonce = fichier.replaceAll('%%NONCE%%', nonceAleatoire);
        const avecNonceEtVersion = avecNonce.replaceAll('%%VERSION%%', adaptateurEnvironnement.versionDeConstruction());
        reponse.send(avecNonceEtVersion);
      } catch {
        reponse
          .status(404)
          .set('Content-Type', 'text/html')
          .envoieFichierEnrichi(fournisseurChemin.ressourceDeBase('404.html'));
      }
    };
    suite();
  };

  const positionneLesCsp = () => async (requete: Request, reponse: Response, suite: NextFunction) =>
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: [
            "'self'",
            ...(process.env.SVELTE_DEV_LOCAL_AVEC_HOT_RELOAD === 'true' ? [`'nonce-${reponse.locals.nonce}'`] : []),
            'https://stats.beta.gouv.fr',
            'https://browser.sentry-cdn.com',
            'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com',
          ],
          imgSrc: [
            "'self'",
            'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com',
            'https://storage.crisp.chat',
            adaptateurEnvironnement.urlCellar().ressourcesCyber(),
            'data:',
          ],
          connectSrc: [
            "'self'",
            'https://stats.beta.gouv.fr',
            'https://sentry.incubateur.net',
            ...(process.env.SVELTE_DEV_LOCAL_AVEC_HOT_RELOAD === 'true' ? ['ws://localhost:3001'] : []),
          ],
          mediaSrc: [
            "'self'",
            'https://monservicesecurise-ressources.cellar-c2.services.clever-cloud.com',
            'https://ressources-mac.cellar-c2.services.clever-cloud.com',
            adaptateurEnvironnement.urlCellar().ressourcesCyber(),
          ],
          styleSrc: [
            "'self'",
            ...(process.env.SVELTE_DEV_LOCAL_AVEC_HOT_RELOAD === 'true'
              ? [`'unsafe-inline'`]
              : [`'nonce-${reponse.locals.nonce}'`]),
            'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com',
          ],
        },
      },
    })(requete, reponse, suite);

  const ajouteUtilisateurARequete =
    (entrepotUtilisateur: EntrepotUtilisateur, adaptateurHachage: AdaptateurHachage) =>
    async (requete: Request & { utilisateur?: Utilisateur | undefined }, reponse: Response, suite: NextFunction) => {
      try {
        requete.utilisateur = requete.session?.email
          ? await entrepotUtilisateur.parEmailHache(adaptateurHachage.hache(requete.session?.email))
          : undefined;
        suite();
      } catch {
        reponse.sendStatus(500);
      }
    };

  const verifieModeMaintenance = async (_requete: Request, reponse: Response, suite: NextFunction) => {
    if (adaptateurEnvironnement.maintenance().actif()) {
      reponse
        .status(HttpStatusCode.ServiceUnavailable)
        .set('Content-Type', 'text/html')
        .envoieFichierEnrichi(fournisseurChemin.ressourceDeBase('maintenance.html'));
    } else {
      suite();
    }
  };

  return {
    verifieJWT,
    verifieJWTNavigation,
    interdisLaMiseEnCache,
    ajouteMethodeEnrichissement,
    positionneLesCsp,
    ajouteUtilisateurARequete,
    verifieModeMaintenance,
  };
};

export const filetRouteAsynchrone =
  (route: RequestHandler) => (requete: Request, reponse: Response, suite: NextFunction) => {
    Promise.resolve(route(requete, reponse, suite)).catch(suite);
  };
