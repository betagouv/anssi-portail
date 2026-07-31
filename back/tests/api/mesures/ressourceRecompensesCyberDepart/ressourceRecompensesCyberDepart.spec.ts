import AdmZip from 'adm-zip';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import sharp from 'sharp';
import request from 'supertest';
import { ServiceRécompensesCyberDépart } from '../../../../src/api/mesures/ressourceRecompensesCyberDepart/serviceRecompensesCyberDepart.js';
import { creeServeur } from '../../../../src/api/msc.js';
import { EntrepotUtilisateur } from '../../../../src/metier/entrepotUtilisateur.js';
import { Module } from '../../../../src/metier/module.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { EntrepôtModuleMémoire } from '../../../persistance/EntrepôtModuleMémoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';
import { mesureDeTest } from '../constructeurDeMesure.js';

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
    serviceRécompensesCyberDépart = new ServiceRécompensesCyberDépart(fauxFournisseurDeChemin);
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
    const reponse = await request(serveur).get('/api/cyberdepart/recompenses.zip');

    assert.equal(reponse.status, 401);
  });

  it("renvoie un 403 si l'utilisateur tente d'obtenir les récompenses sans avoir suffisamment complété le module", async () => {
    jeanneDupont.mesuresPrisesEnCompte = [];

    const reponse = await request(serveur).get('/api/cyberdepart/recompenses.zip').set('Cookie', cookieJeanneDupont);

    assert.equal(reponse.status, 403);
  });

  it('renvoie un zip', async () => {
    jeanneDupont.mesuresPrisesEnCompte = mesures;
    const reponse = await request(serveur).get('/api/cyberdepart/recompenses.zip').set('Cookie', cookieJeanneDupont);

    assert.equal(reponse.status, 200);
    assert.equal(reponse.headers['content-type'], 'application/zip');
    assert.equal(reponse.headers['content-disposition'], 'attachment; filename="recompenses.zip"');
  });

  describe('L\'archive "recompenses.zip"', () => {
    const requêteEntréeArchive = async (chemin: string, nomFichier: string): Promise<AdmZip.IZipEntry | undefined> => {
      const reponse = await request(serveur).get(chemin).set('Cookie', cookieJeanneDupont).responseType('blob');

      const archive = new AdmZip(reponse.body);
      return archive.getEntries().find((entrée) => entrée.name === nomFichier);
    };

    const extraisMetadonnées = async (entrée: AdmZip.IZipEntry) => await sharp(entrée.getData()).metadata();

    it('contient la bannière au format PNG', async () => {
      jeanneDupont.mesuresPrisesEnCompte = mesures;

      const bannierePng = await requêteEntréeArchive('/api/cyberdepart/recompenses.zip', 'banniere.png');

      assert.notEqual(bannierePng, undefined);
      const metadonnées = await extraisMetadonnées(bannierePng!);
      assert.equal(metadonnées.format, 'png');
      assert.notEqual(metadonnées.size, 0);
    });

    it('la taille de la bannière est correcte', async () => {
      jeanneDupont.mesuresPrisesEnCompte = mesures;
      const bannierePng = await requêteEntréeArchive('/api/cyberdepart/recompenses.zip', 'banniere.png');

      assert.notEqual(bannierePng, undefined);
      const metadonnées = await extraisMetadonnées(bannierePng!);
      assert.equal(metadonnées.width, 996);
      assert.equal(metadonnées.height, 420);
    });

    it('contient le badge au format PNG', async () => {
      jeanneDupont.mesuresPrisesEnCompte = mesures;

      const badgePng = await requêteEntréeArchive('/api/cyberdepart/recompenses.zip', 'badge.png');

      assert.notEqual(badgePng, undefined);
      const metadonnées = await extraisMetadonnées(badgePng!);
      assert.equal(metadonnées.format, 'png');
      assert.notEqual(metadonnées.size, 0);
    });
  });
});
