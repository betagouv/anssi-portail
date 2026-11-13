import * as Sentry from '@sentry/browser';

const dsn = document?.getElementById('script-sentry')?.dataset.dsn;
const environment = document?.getElementById('script-sentry')?.dataset.environnement;

const URL_EXTENSION_NAVIGATEUR = /^(chrome|moz|safari|safari-web)-extension:\/\//;

// Messages d'erreurs d'extensions qui remontent sans stack trace exploitable
const MESSAGES_EXTENSIONS_NAVIGATEUR = [/Invalid call to runtime\.sendMessage/, /Tab not found/];

const estUneFrameDExtension = (frame: Sentry.StackFrame) => URL_EXTENSION_NAVIGATEUR.test(frame.filename ?? '');

const estUnMessageDExtension = (message = '') => MESSAGES_EXTENSIONS_NAVIGATEUR.some((motif) => motif.test(message));

const estUneExceptionDExtension = ({ stacktrace, value }: Sentry.Exception) =>
  Boolean(stacktrace?.frames?.some(estUneFrameDExtension)) || estUnMessageDExtension(value);

const provientDUneExtensionNavigateur = (evenement: Sentry.ErrorEvent) =>
  Boolean(evenement.exception?.values?.some(estUneExceptionDExtension));

// Voir l'issue https://github.com/axios/axios/issues/6209#issuecomment-2299747509
const avantEnvoiSentry = (evenement: Sentry.ErrorEvent, detail: Sentry.EventHint) => {
  if (provientDUneExtensionNavigateur(evenement)) {
    return null;
  }

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
