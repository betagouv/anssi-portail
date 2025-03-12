const dsn = document.getElementById('script-sentry').dataset.dsn;
const environment = document.getElementById('script-sentry').dataset.environnement;

Sentry.init({
  dsn,
  environment
});

Sentry.setTag('msc-source', 'frontend');
