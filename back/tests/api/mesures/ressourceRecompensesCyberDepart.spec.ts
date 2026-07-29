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
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { Module } from '../../../src/metier/module.js';
import { mesureDeTest } from './constructeurDeMesure.js';

describe('La ressource des récompenses CyberDépart', () => {
  let serveur: Express;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let entrepôtModule: EntrepôtModuleMémoire;
  let serviceRécompensesCyberDépart: ServiceRécompensesCyberDépart;
  const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });

  const ID_MODULE_CYBERDÉPART = 1;
  const mesures = [1, 2, 3, 4, 5].map((id) =>
    mesureDeTest().avecIdModule(ID_MODULE_CYBERDÉPART).avecLId(`m${id}`).construis()
  );

  beforeEach(async () => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    entrepôtModule = new EntrepôtModuleMémoire();
    serviceRécompensesCyberDépart = new ServiceRécompensesCyberDépart();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotUtilisateur,
      entrepôtModule,
      serviceRécompensesCyberDépart,
    });

    await entrepotUtilisateur.ajoute(jeanneDupont);

    const moduleCyberdépart = new Module(ID_MODULE_CYBERDÉPART, 'Cyberdépart');
    moduleCyberdépart.mesures = mesures;
    await entrepôtModule.ajoute(moduleCyberdépart);
  });

  it('renvoie un 401 pour une requête non-connectée', async () => {
    const reponse = await request(serveur).get('/api/cyberdepart/recompenses');

    assert.equal(reponse.status, 401);
  });

  it("renvoie un 403 si l'utilisateur tente d'obtenir les récompenses sans avoir suffisamment complété le module", async () => {
    jeanneDupont.mesuresPrisesEnCompte = [];

    const reponse = await request(serveur).get('/api/cyberdepart/recompenses').set('Cookie', cookieJeanneDupont);

    assert.equal(reponse.status, 403);
  });

  it('renvoie une bannière PNG à la taille originale par défaut', async () => {
    jeanneDupont.mesuresPrisesEnCompte = mesures;
    const reponse = await request(serveur).get('/api/cyberdepart/recompenses').set('Cookie', cookieJeanneDupont);
    const pngMetadata = await sharp(reponse.body).metadata();

    assert.equal(reponse.status, 200);
    assert.equal(reponse.headers['content-type'], 'image/png');
    assert.equal(pngMetadata.width, 996);
    assert.equal(pngMetadata.height, 420);
  });
});
