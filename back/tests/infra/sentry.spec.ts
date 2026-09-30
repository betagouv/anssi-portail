import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { controleurErreursSentry } from '../../src/infra/sentry.js';

vi.mock('@sentry/node', async (importeOriginal) => ({
  ...(await importeOriginal<typeof import('@sentry/node')>()),
  captureException: vi.fn(),
}));

describe("L'adaptateur de gestion des erreurs Sentry", () => {
  let reponse: Response;
  let suite: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    reponse = {
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
    } as unknown as Response;
    suite = vi.fn();
  });

  it("capture et propage l'erreur", () => {
    const erreur = new Error('Erreur inattendue');

    controleurErreursSentry(erreur, {} as Request, reponse, suite);

    expect(Sentry.captureException).toHaveBeenCalledExactlyOnceWith(erreur);
    expect(suite).toHaveBeenCalledExactlyOnceWith(erreur);
  });
});
