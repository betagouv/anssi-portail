import * as Sentry from '@sentry/node';
import { describe, expect, it, vi } from 'vitest';
import { rapporteurConsole } from '../../src/infra/rapporteurConsole.js';
import { initialiseSentry, rapporteurSentry } from '../../src/infra/sentry.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';

vi.mock('@sentry/node', () => ({
  init: vi.fn(),
  setTag: vi.fn(),
  captureException: vi.fn(),
  expressIntegration: vi.fn(),
  getAutoPerformanceIntegrations: () => [],
}));

describe('Le rapporteur d’erreur', () => {
  it('écrit dans la console avec le contexte et l’exception originale', () => {
    const consoleErreur = vi.spyOn(console, 'error').mockImplementation(() => {});
    const erreur = new Error('échec');
    rapporteurConsole.erreur(erreur, 'opération');
    expect(consoleErreur).toHaveBeenCalledWith('opération', erreur);
    expect(Sentry.init).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
  it('accepte une valeur levée sans contexte', () => {
    const consoleErreur = vi.spyOn(console, 'error').mockImplementation(() => {});
    rapporteurConsole.erreur('échec');
    expect(consoleErreur).toHaveBeenCalledWith('échec');
  });
  it('initialise Sentry séparément du signalement', () => {
    initialiseSentry(fauxAdaptateurEnvironnement);
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: fauxAdaptateurEnvironnement.sentry.dsn() })
    );
    expect(Sentry.setTag).toHaveBeenCalledWith('msc-source', 'backend');
  });
  it('transmet l’exception originale et son contexte à Sentry', () => {
    const erreur = new Error('échec', { cause: new Error('cause') });
    rapporteurSentry.erreur(erreur, 'opération');
    expect(Sentry.captureException).toHaveBeenCalledWith(erreur, { extra: { contexte: 'opération' } });
  });
});
