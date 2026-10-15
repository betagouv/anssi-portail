import { HttpStatusCode } from '@anssi-portail/axios';
import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import expressIpFilter from 'express-ipfilter';
import { adaptateurEnvironnement } from './adaptateurEnvironnement.js';

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
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: {
          request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
          response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
        },
        httpBodies: [],
        urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
        genAI: { inputs: false, outputs: false },
        databaseQueryData: false,
        queues: false,
        graphQL: { document: false, variables: false },
      },
      integrations: [
        ...Sentry.getAutoPerformanceIntegrations(),
        Sentry.expressIntegration({ shouldHandleError: false }),
      ],
    });
    Sentry.setTag('msc-source', 'backend');
  },
  controleurErreurs: (erreur: Error, _requete: Request, reponse: Response, suite: NextFunction) => {
    if (erreur instanceof IpDeniedError) {
      reponse.status(HttpStatusCode.Unauthorized);
      reponse.end();
    } else {
      Sentry.captureException(erreur);
      suite(erreur);
    }
  },
};
