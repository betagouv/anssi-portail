import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi';

describe('La ressource mesure de sécurité', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;

    beforeEach(() => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotMesure, adaptateurEnvironnement });
    });

    it('réponds 200', async () => {
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const reponse = await request(serveur).get('/api/mesures/AUTH.5');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les détails de la mesure', async () => {
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const { body } = await request(serveur).get('/api/mesures/AUTH.5');

      assert.equal(body.id, 'AUTH.5');
      assert.equal(
        body.titre,
        "Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l'accès aux comptes"
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
* l'accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d’administration.`
      );
      assert.equal(
        body.actionFacileAFaire,
        `**Bonne nouvelle :** dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l'activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`
      );
      assert.equal(body.ordre, 10);
      assert.equal(body.risques.length, 3);
      assert.equal(body.risques[0].libelle, 'Un compte utilise a votre place');
      assert.equal(body.risques[1].libelle, 'Un acces non autorise a un outil en ligne');
      assert.equal(body.risques[2].libelle, 'Connexion frauduleuse sans alerte');
      assert.equal(body.liens.length, 1);
      assert.equal(
        body.liens[0].libelle,
        "Guide ANSSI — Recommandations relatives à l'authentification multifacteur et aux mots de passe"
      );
    });

    it('réponds 404 si la mesure demandée est inconnue', async () => {
      const reponse = await request(serveur).get('/api/mesures/INCONNU.0');

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

      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const serveurSansLaRessource = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
      });
      const reponse = await request(serveurSansLaRessource).get('/api/mesures/AUTH.5');

      assert.equal(reponse.status, 404);
    });
  });
});
