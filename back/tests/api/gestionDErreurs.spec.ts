import express from 'express';
import expressIpFilter from 'express-ipfilter';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { configureLaGestionDErreur } from '../../src/api/msc/middlewares/gestionDErreurs.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La gestion des erreurs HTTP', () => {
  it('renvoie 401 pour une IP refusée sans transmettre ni signaler l’erreur', async () => {
    const app = express();
    const controleurErreurs = vi.fn();
    const rapporteur = { erreur: vi.fn() };
    app.use(() => {
      throw new expressIpFilter.IpDeniedError('refus', '127.0.0.1');
    });
    configureLaGestionDErreur(app, { ...configurationDeTestDuServeur, controleurErreurs, rapporteur });
    expect((await request(app).get('/')).status).toBe(401);
    expect(controleurErreurs).not.toHaveBeenCalled();
    expect(rapporteur.erreur).not.toHaveBeenCalled();
  });
  it('transmet les erreurs au contrôleur injecté puis à Express', async () => {
    const app = express();
    const erreur = new Error('échec');
    const controleurErreurs = vi.fn(configurationDeTestDuServeur.controleurErreurs);
    app.use(() => {
      throw erreur;
    });
    configureLaGestionDErreur(app, { ...configurationDeTestDuServeur, controleurErreurs });
    expect((await request(app).get('/')).status).toBe(500);
    expect(controleurErreurs.mock.calls[0][0]).toBe(erreur);
  });
});
