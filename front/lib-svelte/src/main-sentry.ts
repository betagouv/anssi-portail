import * as Sentry from '@sentry/browser';

const dsn = document?.getElementById('script-sentry')?.dataset.dsn;
const environment = document?.getElementById('script-sentry')?.dataset.environnement;

// Voir l'issue https://github.com/axios/axios/issues/6209#issuecomment-2299747509
const avantEnvoiSentry = (evenement: Sentry.Event, detail: Sentry.EventHint) => {
  const originalException = detail?.originalException as { code: string } | undefined;
  if (originalException?.code === 'ECONNABORTED') {
    return null;
  }
  return evenement;
};

Sentry.init({
  dsn,
  environment,
  beforeSend: avantEnvoiSentry,
});

Sentry.setTag('msc-source', 'frontend');
