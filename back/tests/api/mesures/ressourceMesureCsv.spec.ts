import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { encodeSession } from '../cookie.js';
import { fabriqueModuleCyberdépart, jeanneDupont } from '../objetsPretsALEmploi.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { mesureDeTest } from './constructeurDeMesure.js';

describe('La ressource des mesures en CSV', () => {
  let serveur: Express;
  let entrepôtMesure: EntrepotMesureMemoire;
  let entrepôtModule: EntrepôtModuleMémoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  const cookieJeanneDupont = encodeSession({
    email: jeanneDupont.email,
    token: 'token',
  });

  beforeEach(async () => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    entrepôtMesure = new EntrepotMesureMemoire();
    entrepôtModule = new EntrepôtModuleMémoire();

    await entrepotUtilisateur.ajoute(jeanneDupont);

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotMesure: entrepôtMesure,
      entrepôtModule: entrepôtModule,
      entrepotUtilisateur,
    });
  });

  const BOM_CHAR: string = '\uFEFF';
  const get = () => request(serveur).get('/api/mesures.csv');
  const getConnecté = () => get().set('Cookie', cookieJeanneDupont);

  describe('Sur demande GET', () => {
    it('renvoie en 200', async () => {
      const { status } = await getConnecté();

      assert.equal(status, HttpStatusCode.Ok);
    });

    it('renvoie un contenu CSV', async () => {
      const { headers } = await getConnecté();

      assert.equal(headers['content-type'], 'text/csv; charset=utf-8');
    });

    it('commence le contenu CSV avec un BOM', async () => {
      const { text } = await getConnecté();

      assert.equal(text[0], BOM_CHAR);
    });

    it('contient les en-têtes CSV attendus', async () => {
      const { text } = await getConnecté();
      const lignes = text.split('\n');

      assert.equal(
        lignes[0].slice(BOM_CHAR.length),
        '"Titre du module";"Titre de la mesure";"Description de la mesure"'
      );
    });

    it('contient les mesures sérialisées', async () => {
      const module = fabriqueModuleCyberdépart();
      const mesure = mesureDeTest()
        .avecLeTitre('Mesure 4')
        .avecLesExplications('Des explications')
        .avecIdModule(module.id)
        .construis();
      module.mesures = [mesure];

      await entrepôtModule.ajoute(module);
      await entrepôtMesure.ajoute(mesure);

      const { text } = await getConnecté();

      const lignes = text.split('\n');
      const contenu = lignes[1].split(';');

      assert.equal(contenu[0].slice(1, -1), module.nom);
      assert.equal(contenu[1].slice(1, -1), mesure.titre);
      assert.equal(contenu[2].slice(1, -1), mesure.explications);
    });

    it('ne contient pas de balises HTML dans les descriptions', async () => {
      const module = fabriqueModuleCyberdépart();
      const mesure = mesureDeTest()
        .avecLeTitre('Mesure 4')
        .avecLesExplications(
          `<p>Un mot de <em>passe</em> seul <ul><li>ne</li> <li>suffit</li></ul> pas toujours <span>à protéger</span> un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.</p>`
        )

        .avecIdModule(module.id)
        .construis();
      module.mesures = [mesure];

      await entrepôtModule.ajoute(module);
      await entrepôtMesure.ajoute(mesure);

      const { text } = await getConnecté();

      const lignes = text.split('\n');
      const contenu = lignes[1].split(';');

      assert.equal(contenu[0].slice(1, -1), module.nom);
      assert.equal(contenu[1].slice(1, -1), mesure.titre);
      assert.equal(
        contenu[2].slice(1, -1),
        `Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.`
      );
    });
  });

  describe("lorsque qu'aucun utilisateur n'est connecté", async () => {
    it('réponds 401', async () => {
      const reponse = await get();

      assert.equal(reponse.status, HttpStatusCode.Unauthorized);
    });
  });
});
