import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { fabriqueModuleCyberdépart, jeanneDupont } from '../objetsPretsALEmploi.js';
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

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu CSV', async () => {
      const { headers } = await getConnecté();

      expect(headers['content-type']).toBe('text/csv; charset=utf-8');
    });

    it('commence le contenu CSV avec un BOM', async () => {
      const { text } = await getConnecté();

      expect(text[0]).toBe(BOM_CHAR);
    });

    it('contient les en-têtes CSV attendus', async () => {
      const { text } = await getConnecté();
      const lignes = text.split('\n');

      expect(lignes[0].slice(BOM_CHAR.length)).toBe(
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

      expect(contenu[0].slice(1, -1)).toBe(module.nom);
      expect(contenu[1].slice(1, -1)).toBe(mesure.titre);
      expect(contenu[2].slice(1, -1)).toBe(mesure.explications);
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

      expect(contenu[0].slice(1, -1)).toBe(module.nom);
      expect(contenu[1].slice(1, -1)).toBe(mesure.titre);
      expect(contenu[2].slice(1, -1)).toBe(
        `Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.`
      );
    });
  });

  describe("lorsque qu'aucun utilisateur n'est connecté", async () => {
    it('réponds 401', async () => {
      const reponse = await get();

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });
  });
});
