const dsn = document.getElementById('script-sentry').dataset.dsn;
const environment =
  document.getElementById('script-sentry').dataset.environnement;

// Voir l'issue https://github.com/axios/axios/issues/6209#issuecomment-2299747509
const avantEnvoiSentry = (evenement, detail) => {
  if (
    detail?.originalException?.code === 'ECONNABORTED'
  ) {
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
