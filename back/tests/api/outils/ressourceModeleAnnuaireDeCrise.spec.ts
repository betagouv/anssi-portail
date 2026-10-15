import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';

describe("La ressource du modèle de l'annuaire de crise", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur une requête GET', () => {
    const récupèreModèle = async (mode: 'connecté' | 'non-connecté' = 'connecté') => {
      const ressource = request(serveur).get('/api/outils/modele-annuaire-de-crise.xlsx');
      const requête =
        mode === 'connecté'
          ? ressource.set('Cookie', [encodeSession({ email: jeanneDupont.email, token: 'valide' })])
          : ressource;

      return requête.buffer(true).parse((res, callback) => {
        const morceaux: Buffer[] = [];
        res.on('data', (morceau: Buffer) => morceaux.push(morceau));
        res.on('end', () => callback(null, Buffer.concat(morceaux)));
      });
    };

    it('réponds 200', async () => {
      const { status } = await récupèreModèle();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu XLSX', async () => {
      const { headers } = await récupèreModèle();

      expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(headers['content-disposition']).toBe('attachment; filename="modele-annuaire-de-crise.xlsx"');
    });

    it('renvoie un fichier valide', async () => {
      const { body } = await récupèreModèle();

      expect(Buffer.isBuffer(body)).toBe(true);
    });

    it('refuse un utilisateur non connecté', async () => {
      const { status } = await récupèreModèle('non-connecté');

      expect(status).toBe(HttpStatusCode.Unauthorized);
    });
  });
});
