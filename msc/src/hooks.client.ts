import { captureException } from '@sentry/browser';
import type { HandleClientError } from '@sveltejs/kit/hooks';

export const init = async () => {
  if (document.getElementById('script-sentry')?.dataset.dsn) await import('$msc/main-sentry');
};
export const handleError: HandleClientError = ({ error, kind }) => {
  if (kind === 'unknown' || (kind === 'framework' && error.status >= 500)) captureException(error);
};
