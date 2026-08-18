import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import expressIpFilter from 'express-ipfilter';
import { adaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { HttpStatusCode } from '@anssi-portail/axios';

const { IpDeniedError } = expressIpFilter;

export interface AdaptateurGestionErreur {
  initialise(): void;
  controleurErreurs(erreur: Error, requete: Request, reponse: Response, suite: NextFunction): void;
}

export const adaptateurGestionErreurSentry: AdaptateurGestionErreur = {
  initialise: () => {
    const config = adaptateurEnvironnement.sentry();

    Sentry.init({
      dsn: config.dsn(),
      environment: config.environnement(),
      integrations: [...Sentry.getAutoPerformanceIntegrations()],
    });
    Sentry.setTag('msc-source', 'backend');
  },
  controleurErreurs: (erreur: Error, requete: Request, reponse: Response, suite: NextFunction) => {
    if (erreur instanceof IpDeniedError) {
      reponse.status(HttpStatusCode.Unauthorized);
      reponse.end();
    } else {
      const gestionnaireErreurSentry = Sentry.expressErrorHandler();
      gestionnaireErreurSentry(
        erreur,
        requete as Parameters<typeof gestionnaireErreurSentry>[1],
        reponse as unknown as Parameters<typeof gestionnaireErreurSentry>[2],
        suite
      );
    }
  },
};
