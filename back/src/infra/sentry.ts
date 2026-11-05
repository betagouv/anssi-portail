import * as Sentry from '@sentry/node';
import { ErrorRequestHandler } from 'express';
import { Rapporteur } from '../metier/rapporteur.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';

export const initialiseSentry = (environnement: AdaptateurEnvironnement) => {
  const config = environnement.sentry;
  Sentry.init({
    dsn: config.dsn(),
    environment: config.environnement(),
    integrations: [...Sentry.getAutoPerformanceIntegrations()],
  });
  Sentry.setTag('msc-source', 'backend');
};

export const rapporteurSentry: Rapporteur = {
  erreur: (erreur, message) => {
    Sentry.captureException(erreur, message === undefined ? undefined : { extra: { contexte: message } });
  },
};

export const controleurErreursSentry: ErrorRequestHandler = (erreur, requete, reponse, suite) => {
  const gestionnaire = Sentry.expressErrorHandler();
  gestionnaire(
    erreur,
    requete as Parameters<typeof gestionnaire>[1],
    reponse as unknown as Parameters<typeof gestionnaire>[2],
    suite
  );
};
