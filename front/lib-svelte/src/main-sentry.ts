import * as Sentry from '@sentry/browser';

const dsn = document?.getElementById('script-sentry')?.dataset.dsn;
const environment = document?.getElementById('script-sentry')?.dataset.environnement;

// Voir l'issue https://github.com/axios/axios/issues/6209#issuecomment-2299747509
const avantEnvoiSentry = (evenement: Sentry.ErrorEvent, detail: Sentry.EventHint) => {
  const originalException = detail?.originalException as { code: string; message: string } | undefined;
  if (originalException?.code === 'ECONNABORTED') {
    return null;
  }
  // Erreur réseau Axios sans réponse (status 0) : déconnexion client, CORS, serveur injoignable
  if (originalException?.message === 'Network Error') {
    return null;
  }
  if (evenement.exception?.values?.[0]?.value?.includes('Object Not Found Matching Id')) {
    return null;
  }

  return evenement;
};

Sentry.init({
  dsn,
  environment,
  beforeSend: avantEnvoiSentry,
  integrations: [
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['mes-services-cyber'],
      behaviour: 'drop-error-if-contains-third-party-frames',
    }),
  ],
});

Sentry.setTag('msc-source', 'frontend');
