import { HttpStatusCode } from '@anssi-portail/axios';
import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import expressIpFilter from 'express-ipfilter';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adaptateurGestionErreurSentry } from '../../src/infra/adaptateurGestionErreurSentry.js';

vi.mock('@sentry/node', async (importeOriginal) => ({
  ...(await importeOriginal<typeof import('@sentry/node')>()),
  captureException: vi.fn(),
}));

const { IpDeniedError } = expressIpFilter;

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

    adaptateurGestionErreurSentry.controleurErreurs(erreur, {} as Request, reponse, suite);

    expect(Sentry.captureException).toHaveBeenCalledExactlyOnceWith(erreur);
    expect(suite).toHaveBeenCalledExactlyOnceWith(erreur);
  });

  it("ne capture pas une erreur d'adresse IP interdite", () => {
    const erreur = new IpDeniedError('Adresse IP interdite', { ip: '127.0.0.1' });

    adaptateurGestionErreurSentry.controleurErreurs(erreur, {} as Request, reponse, suite);

    expect(Sentry.captureException).not.toHaveBeenCalled();
    expect(suite).not.toHaveBeenCalled();
    expect(reponse.status).toHaveBeenCalledExactlyOnceWith(HttpStatusCode.Unauthorized);
    expect(reponse.end).toHaveBeenCalledExactlyOnceWith();
  });
});
