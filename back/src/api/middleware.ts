import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AdaptateurJWT } from './adaptateurJWT';
import fs from 'node:fs';
import { randomBytes } from 'node:crypto';
import helmet from 'helmet';
import { FournisseurChemin } from './fournisseurChemin';
import { Utilisateur } from '../metier/utilisateur';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { AdaptateurEnvironnement } from '../infra/adaptateurEnvironnement';
import { HttpStatusCode } from 'axios';

type FonctionMiddleware = (
  requete: Request,
  reponse: Response,
  suite: NextFunction
) => Promise<void>;

export type Middleware = {
  aseptise: (...nomsParametres: string[]) => FonctionMiddleware;
  valide: () => FonctionMiddleware;
  interdisLaMiseEnCache: FonctionMiddleware;
  verifieJWT: FonctionMiddleware;
  verifieJWTNavigation: FonctionMiddleware;
  ajouteMethodeNonce: FonctionMiddleware;
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
  const aseptise =
    (...nomsParametres: string[]) =>
    async (requete: Request, _reponse: Response, suite: NextFunction) => {
      const aseptisations = nomsParametres.map((p) =>
        check(p).trim().escape().run(requete)
      );
      await Promise.all(aseptisations);
      suite();
    };

  const valide =
    () => async (requete: Request, reponse: Response, suite: NextFunction) => {
      const erreurs = validationResult(requete);
      if (!erreurs.isEmpty()) {
        reponse.status(400).json({ erreur: erreurs.array()[0].msg });
        return;
      }
      suite();
    };

  const interdisLaMiseEnCache = async (
    _requete: Request,
    reponse: Response,
    suite: NextFunction
  ) => {
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

  const verifieJWTNavigation = async (
    requete: Request,
    reponse: Response,
    suite: NextFunction
  ) => {
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

  const ajouteMethodeNonce = async (
    _: Request,
    reponse: Response,
    suite: NextFunction
  ) => {
    const nonceAleatoire = randomBytes(16).toString('base64');
    reponse.locals.nonce = nonceAleatoire;
    reponse.sendFileAvecNonce = (chemin: string) => {
      try {
        const fichier = fs.readFileSync(chemin, 'utf-8');
        const avecNonce = fichier.replace('%%NONCE%%', nonceAleatoire);
        reponse.send(avecNonce);
      } catch {
        reponse
          .status(404)
          .set('Content-Type', 'text/html')
          .sendFileAvecNonce(fournisseurChemin.ressourceDeBase('404.html'));
      }
    };
    suite();
  };

  const positionneLesCsp =
    () => async (requete: Request, reponse: Response, suite: NextFunction) =>
      helmet({
        contentSecurityPolicy: {
          directives: {
            scriptSrc: [
              "'self'",
              'https://stats.beta.gouv.fr',
              'https://browser.sentry-cdn.com',
              'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com',
            ],
            imgSrc: [
              "'self'",
              'https://lab-anssi-ui-kit-prod-s3-assets.cellar-c2.services.clever-cloud.com',
              'https://storage.crisp.chat',
            ],
            connectSrc: ["'self'", 'https://stats.beta.gouv.fr'],
            mediaSrc: [
              "'self'",
              'https://monservicesecurise-ressources.cellar-c2.services.clever-cloud.com',
              'https://ressources-mac.cellar-c2.services.clever-cloud.com',
              'https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com',
            ],
            styleSrc: ["'self'", `'nonce-${reponse.locals.nonce}'`],
          },
        },
      })(requete, reponse, suite);

  const ajouteUtilisateurARequete =
    (
      entrepotUtilisateur: EntrepotUtilisateur,
      adaptateurHachage: AdaptateurHachage
    ) =>
    async (
      requete: Request & { utilisateur?: Utilisateur | undefined },
      reponse: Response,
      suite: NextFunction
    ) => {
      try {
        requete.utilisateur = requete.session?.email
          ? await entrepotUtilisateur.parEmailHache(
              adaptateurHachage.hache(requete.session?.email)
            )
          : undefined;
        suite();
      } catch {
        reponse.sendStatus(500);
      }
    };

  const verifieModeMaintenance = async (
    _requete: Request,
    reponse: Response,
    suite: NextFunction
  ) => {
    if (adaptateurEnvironnement.maintenance().actif()) {
      reponse
        .status(HttpStatusCode.ServiceUnavailable)
        .set('Content-Type', 'text/html')
        .sendFileAvecNonce(
          fournisseurChemin.ressourceDeBase('maintenance.html')
        );
    } else {
      suite();
    }
  };

  return {
    aseptise,
    valide,
    verifieJWT,
    verifieJWTNavigation,
    interdisLaMiseEnCache,
    ajouteMethodeNonce,
    positionneLesCsp,
    ajouteUtilisateurARequete,
    verifieModeMaintenance,
  };
};
