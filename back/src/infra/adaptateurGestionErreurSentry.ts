import { Express, Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { IpDeniedError } from 'express-ipfilter';

export interface AdaptateurGestionErreur {
  initialise(applicationExpress: Express): void;
  controleurErreurs(
    erreur: Error,
    requete: Request,
    reponse: Response,
    suite: NextFunction
  ): void;
}

export const adaptateurGestionErreurSentry: AdaptateurGestionErreur = {
  initialise: (applicationExpress: Express) => {
    const config = adaptateurEnvironnement.sentry();

    Sentry.init({
      dsn: config.dsn(),
      environment: config.environnement(),
      integrations: [
        new Sentry.Integrations.Express({ app: applicationExpress }),
        new Sentry.Integrations.Postgres(),
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],
    });
    Sentry.setTag('msc-source', 'backend');

    applicationExpress.use(Sentry.Handlers.requestHandler());
    applicationExpress.use(Sentry.Handlers.tracingHandler());
  },
  controleurErreurs: (
    erreur: Error,
    requete: Request,
    reponse: Response,
    suite: NextFunction
  ) => {
    if (erreur instanceof IpDeniedError) {
      reponse.status(401);
      reponse.end();
    } else {
      Sentry.Handlers.errorHandler()(erreur, requete, reponse, suite);
    }
  },
};
