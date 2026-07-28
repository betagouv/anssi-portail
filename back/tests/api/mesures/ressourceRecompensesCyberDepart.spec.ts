import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import sharp from 'sharp';
import { creeServeur } from '../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { encodeSession } from '../cookie.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';
import { Express } from 'express';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { ServiceRécompensesCyberDépart } from '../../../src/api/mesures/ressourceRecompensesCyberDepart/serviceRecompensesCyberDepart.js';

describe('La ressource des récompenses CyberDépart', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let serviceRécompensesCyberDépart: ServiceRécompensesCyberDépart;
  const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });

  beforeEach(async () => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serviceRécompensesCyberDépart = new ServiceRécompensesCyberDépart();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
      serviceRécompensesCyberDépart,
    });

    await entrepotUtilisateur.ajoute(jeanneDupont);
  });

  it('renvoie une bannière PNG à la taille originale par défaut', async () => {
    const reponse = await request(serveur).get('/api/cyberdepart/recompenses').set('Cookie', cookieJeanneDupont);
    const pngMetadata = await sharp(reponse.body).metadata();

    assert.equal(reponse.status, 200);
    assert.equal(reponse.headers['content-type'], 'image/png');
    assert.equal(pngMetadata.width, 996);
    assert.equal(pngMetadata.height, 420);
  });
});
