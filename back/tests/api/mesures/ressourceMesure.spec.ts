import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { Mesure } from '../../../src/metier/mesure.js';
import { ExigenceNIS2 } from '../../../src/metier/nis2/exigence.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';
import { jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi.js';
import { utilisateurDeTest } from './constructeurDUtilisateur.js';

describe('La ressource mesure de sécurité', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let authentA2Etapes: Mesure;
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });

    async function getConnecte(serveur: Express, cookieJeanneDupont: string) {
      return request(serveur).get('/api/mesures/AUTH.5').set('Cookie', cookieJeanneDupont);
    }

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      authentA2Etapes = mesureAuthentA2Etapes();
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        entrepotUtilisateur,
        adaptateurEnvironnement,
      });

      await entrepotUtilisateur.ajoute(jeanneDupont);
      await entrepotMesure.ajoute(authentA2Etapes);
    });

    it('réponds 200', async () => {
      const reponse = await getConnecte(serveur, cookieJeanneDupont);

      assert.equal(reponse.status, 200);
    });

    it('renvoie les détails de la mesure', async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      assert.equal(body.id, 'AUTH.5');
      assert.equal(
        body.titre,
        'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
      );
      assert.equal(body.phraseAccroche, 'Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨');
      assert.equal(
        body.explications,
        `Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.

Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.`
      );
      assert.equal(
        body.actionPrioritaire,
        `Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :
* l’accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d’administration.`
      );
      assert.equal(
        body.actionFacileAFaire,
        `Dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l’activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`
      );
      assert.equal(body.ordre, 10);
      assert.equal(body.risques.length, 3);
      assert.equal(body.risques[0].libelle, 'Un compte utilise a votre place');
      assert.equal(body.risques[1].libelle, 'Un acces non autorise a un outil en ligne');
      assert.equal(body.risques[2].libelle, 'Connexion frauduleuse sans alerte');
      assert.equal(body.liens.length, 1);
      assert.equal(
        body.liens[0].libelle,
        'Guide ANSSI — Recommandations relatives à l’authentification multifacteur et aux mots de passe'
      );
    });

    it('renvoie les informations ReCyF de la mesure', async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      assert.equal(body.exigences.length, 1);
      const exigence = body.exigences[0] as ExigenceNIS2;
      assert.equal(exigence.reference, '10.B.5-EI/EE');
      assert.deepEqual(exigence.entitesCible, ['EntiteEssentielle', 'EntiteImportante']);
      assert.equal(
        exigence.objectifSecurite,
        'Objectif de sécurité 10: Gestion des identités et des accès des utilisateurs aux systèmes d’information'
      );
      assert.equal(exigence.thematique, 'Authentification');
      assert.equal(exigence.contenu, 'Les facteurs d’authentification...');
      assert.equal(exigence.contenuEnAnglais, 'The authentication factors...');
    });

    it('réponds 404 si la mesure demandée est inconnue', async () => {
      const reponse = await request(serveur).get('/api/mesures/INCONNU.0').set('Cookie', cookieJeanneDupont);

      assert.equal(reponse.status, 404);
    });

    it('réponds 404 si la fonctionnalité est désactivée', async () => {
      const adaptateurEnvironnement: AdaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
        fonctionnalites: () => ({
          ...fauxAdaptateurEnvironnement.fonctionnalites(),
          parcoursDeSecurisation: () => ({
            estActif: () => false,
          }),
        }),
      };

      const serveurSansLaRessource = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
      });
      const reponse = await request(serveurSansLaRessource).get('/api/mesures/AUTH.5');

      assert.equal(reponse.status, 404);
    });

    it('indique que la mesure a été prise en compte', async () => {
      const unUtilisateurAvecUnePriseEnCompte = utilisateurDeTest()
        .avecUneMesurePriseEnCompte(authentA2Etapes)
        .construis();

      const cookie = encodeSession({ email: unUtilisateurAvecUnePriseEnCompte.email, token: 'valide' });
      await entrepotUtilisateur.ajoute(unUtilisateurAvecUnePriseEnCompte);

      const { body } = await getConnecte(serveur, cookie);

      assert.equal(body.estPriseEnCompte, true);
    });

    it('indique qu’une mesure n’a pas été prise en compte', async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      assert.equal(body.estPriseEnCompte, false);
    });

    describe("lorsque qu'aucun utilisateur n'est connecté", async () => {
      it('réponds 401', async () => {
        const reponse = await request(serveur).get('/api/mesures/AUTH.5');

        assert.equal(reponse.status, 401);
      });
    });
    it("renvoie l'id du module d'une mesure", async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      assert.equal(body.idModule, 3);
    });
  });
});
