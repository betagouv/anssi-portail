import { HttpStatusCode } from 'axios';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import helmet from 'helmet';
import jsonwebtoken from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import { AdaptateurEnrichissement } from '../infra/adaptateurEnrichissement.js';
import { AdaptateurEnvironnement } from '../infra/adaptateurEnvironnement.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur.js';
import { Utilisateur } from '../metier/utilisateur.js';
import { AdaptateurJWT } from './adaptateurJWT.js';
import { FournisseurChemin } from './fournisseurChemin.js';
import { detruisSession } from './session.js';

const { JsonWebTokenError, TokenExpiredError } = jsonwebtoken;

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
  adaptateurEnrichissement,
}: {
  adaptateurJWT: AdaptateurJWT;
  fournisseurChemin: FournisseurChemin;
  adaptateurEnvironnement: AdaptateurEnvironnement;
  adaptateurEnrichissement: AdaptateurEnrichissement;
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
    reponse.envoieFichierEnrichi = async (chemin: string) => {
      try {
        const fichier = fs.readFileSync(chemin, 'utf-8');
        const avecNonce = fichier.replaceAll('%%NONCE%%', nonceAleatoire);
        const avecNonceEtVersion = avecNonce.replaceAll('%%VERSION%%', adaptateurEnvironnement.versionDeConstruction());
        const contenuPage = await adaptateurEnrichissement.enrichisAvecComposants(avecNonceEtVersion);

        reponse.send(contenuPage);
      } catch {
        await reponse
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
      if (!requete.session?.token) {
        suite();
        return;
      }
      try {
        adaptateurJWT.decode(requete.session?.token);
      } catch (e) {
        if (e instanceof TokenExpiredError) {
          detruisSession(requete, reponse);
          suite();
          return;
        }
        if (e instanceof JsonWebTokenError) {
          reponse.sendStatus(401);
          return;
        }
      }
      try {
        if (requete.session?.email) {
          const emailHache = adaptateurHachage.hache(requete.session.email);
          requete.utilisateur = await entrepotUtilisateur.parEmailHache(emailHache);
        }
        suite();
      } catch {
        reponse.sendStatus(500);
      }
    };

  const verifieModeMaintenance = async (_requete: Request, reponse: Response, suite: NextFunction) => {
    if (adaptateurEnvironnement.maintenance().actif()) {
      await reponse
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
