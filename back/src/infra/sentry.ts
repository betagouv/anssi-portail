import * as Sentry from '@sentry/node';
import { ErrorRequestHandler } from 'express';
import { Rapporteur } from '../metier/rapporteur.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';

export const initialiseSentry = (environnement: AdaptateurEnvironnement) => {
  const config = environnement.sentry;
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
    integrations: [...Sentry.getAutoPerformanceIntegrations(), Sentry.expressIntegration({ shouldHandleError: false })],
  });
  Sentry.setTag('msc-source', 'backend');
};

export const rapporteurSentry: Rapporteur = {
  erreur: (erreur, message) => {
    Sentry.captureException(erreur, message === undefined ? undefined : { extra: { contexte: message } });
  },
};

export const controleurErreursSentry: ErrorRequestHandler = (erreur, _requete, _reponse, suite) => {
  Sentry.captureException(erreur);
  suite(erreur);
};
