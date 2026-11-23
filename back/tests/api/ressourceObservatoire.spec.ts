import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { AdaptateurObservatoire } from '../../src/infra/observatoireDesDonnees/adaptateurObservatoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource Observatoire', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let adaptateurObservatoire: AdaptateurObservatoire;

    const serveurAvecObservatoire = (actif: boolean) =>
      creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurObservatoire,
        adaptateurEnvironnement: {
          ...configurationDeTestDuServeur.adaptateurEnvironnement,
          fonctionnalites: {
            ...configurationDeTestDuServeur.adaptateurEnvironnement.fonctionnalites,
            observatoire: () => actif,
          },
        },
      });

    beforeEach(() => {
      adaptateurObservatoire = {
        totalServices: async () => 3,
        cumulMensuelServices: async () => [{ mois: '2026-01', cumul: 3 }],
        mesuresFaitesParMois: async () => [{ mois: '2026-01', total: 42 }],
        servicesParNiveauSecurite: async () => [{ niveauSecurite: 'Modérés', total: 3 }],
        cumulMensuelHomologations: async () => [{ mois: '2026-01', cumul: 1 }],
        dateDerniereExecution: async () => new Date('2026-02-01T08:00:00.000Z'),
      };
      serveur = serveurAvecObservatoire(true);
    });

    it('renvoie tous les chiffres de l’observatoire', async () => {
      const reponse = await request(serveur).get('/api/observatoire');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      expect(reponse.body).toStrictEqual({
        dateDerniereMiseAJour: '2026-02-01T08:00:00.000Z',
        services: {
          total: 3,
          cumulMensuel: [{ mois: '2026-01', cumul: 3 }],
          parNiveauSecurite: [{ niveauSecurite: 'Modérés', total: 3 }],
        },
        mesuresFaites: { parMois: [{ mois: '2026-01', total: 42 }] },
        homologations: { cumulMensuel: [{ mois: '2026-01', cumul: 1 }] },
      });
    });

    it('renvoie une date de dernière mise à jour nulle s’il n’y a jamais eu de chargement', async () => {
      adaptateurObservatoire.dateDerniereExecution = async () => null;

      const reponse = await request(serveur).get('/api/observatoire');

      expect(reponse.body.dateDerniereMiseAJour).toBeNull();
    });

    it('répond 404 lorsque la fonctionnalité est désactivée', async () => {
      const reponse = await request(serveurAvecObservatoire(false)).get('/api/observatoire');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
