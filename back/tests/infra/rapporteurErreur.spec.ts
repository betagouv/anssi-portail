import * as Sentry from '@sentry/node';
import { describe, expect, it, vi } from 'vitest';
import { rapporteurErreurSentry } from '../../src/infra/adaptateurGestionErreurSentry.js';
import { rapporteurErreurConsole } from '../../src/infra/rapporteurErreurConsole.js';

vi.mock('@sentry/node', () => ({
  init: vi.fn(),
  setTag: vi.fn(),
  captureException: vi.fn(),
  getAutoPerformanceIntegrations: () => [],
}));

describe('Le rapporteur d’erreur', () => {
  it('écrit dans la console avec le contexte et l’exception originale', () => {
    const consoleErreur = vi.spyOn(console, 'error').mockImplementation(() => {});
    const erreur = new Error('échec');
    rapporteurErreurConsole.erreur(erreur, 'opération');
    expect(consoleErreur).toHaveBeenCalledWith('opération', erreur);
    expect(Sentry.init).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
  it('accepte une valeur levée sans contexte', () => {
    const consoleErreur = vi.spyOn(console, 'error').mockImplementation(() => {});
    rapporteurErreurConsole.erreur('échec');
    expect(consoleErreur).toHaveBeenCalledWith('échec');
  });
  it('transmet l’exception originale et son contexte à Sentry', () => {
    const erreur = new Error('échec', { cause: new Error('cause') });
    rapporteurErreurSentry.erreur(erreur, 'opération');
    expect(Sentry.captureException).toHaveBeenCalledWith(erreur, { extra: { contexte: 'opération' } });
  });
});
