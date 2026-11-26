import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { ServiceObservatoire } from '@metier/serviceObservatoire.js';
import { creeServeur } from '@api/msc/index.js';
import { AdaptateurObservatoireMenaceCyber } from '@infra/observatoireDesDonnees/adaptateurObservatoireMenaceCyberMemoire.js';
import { AdaptateurObservatoireMSCMemoire } from '@infra/observatoireDesDonnees/adaptateurObservatoireMSCMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource Observatoire', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let serviceObservatoire: ServiceObservatoire;

    const serveurAvecObservatoire = (actif: boolean) =>
      creeServeur({
        ...configurationDeTestDuServeur,
        serviceObservatoire,
        adaptateurEnvironnement: {
          ...configurationDeTestDuServeur.adaptateurEnvironnement,
          fonctionnalites: {
            ...configurationDeTestDuServeur.adaptateurEnvironnement.fonctionnalites,
            observatoire: () => actif,
          },
        },
      });

    beforeEach(() => {
      serviceObservatoire = new ServiceObservatoire({
        adaptateurObservatoireMSS: {
          totalServices: async () => 3,
          cumulMensuelServices: async () => [{ mois: '2026-01', cumul: 3 }],
          mesuresFaitesParMois: async () => [{ mois: '2026-01', total: 42 }],
          servicesParNiveauSecurite: async () => [{ niveauSecurite: 'Modérés', total: 3 }],
          cumulMensuelHomologations: async () => [{ mois: '2026-01', cumul: 1 }],
          dateDerniereExecution: async () => new Date('2026-02-01T08:00:00.000Z'),
        },
        adaptateurObservatoireMSC: new AdaptateurObservatoireMSCMemoire(),
        adaptateurObservatoireMenaceCyber: new AdaptateurObservatoireMenaceCyber(),
      });
      serveur = serveurAvecObservatoire(true);
    });

    it('renvoie les données du service', async () => {
      const reponse = await request(serveur).get('/api/observatoire');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      expect(Object.keys(reponse.body.projets)).toEqual(['services', 'mesuresFaites', 'homologations']);
      expect(Object.keys(reponse.body.organisations)).toEqual([
        'testsMaturite',
        'testsSensibilisation',
        'demarchesInitiees',
        'diagnosticsCyberdepart',
        'cyberdepartsValides',
        'completions',
      ]);
      expect(Object.keys(reponse.body.menaceCyber)).toEqual([
        'evenementsSecurite',
        'incidents',
        'rançongiciels',
        'fraudesVirement',
        'cyberharcèlements',
        'volsDonnées',
      ]);
    });

    it('répond 404 lorsque la fonctionnalité est désactivée', async () => {
      const reponse = await request(serveurAvecObservatoire(false)).get('/api/observatoire');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
