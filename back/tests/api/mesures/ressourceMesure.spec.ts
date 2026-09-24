import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
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

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie les détails de la mesure', async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      expect(body.id).toBe('AUTH.5');
      expect(body.titre).toBe(
        'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
      );
      expect(body.phraseAccroche).toBe('Empêchez qu’un compte soit utilisé, même si le mot de passe a fuité 💨');
      expect(body.explications)
        .toBe(`Un mot de passe seul ne suffit pas toujours à protéger un compte. En activant une deuxième vérification, vous ajoutez une sécurité supplémentaire au moment de la connexion : un code reçu sur une application, une clé physique, une empreinte digitale ou, à défaut, un code par SMS.

Ainsi, même si un mot de passe est volé ou deviné, l’accès au compte reste beaucoup plus difficile pour une personne malveillante.`);
      expect(body.actionPrioritaire)
        .toBe(`Mettre en oeuvre la vérification en deux étapes sur les services importants, a minima :
* l’accès aux mails,
* les services en ligne,
* tous les accès distants (ex. télétravail),
* les comptes d’administration.`);
      expect(body.actionFacileAFaire).toBe(
        `Dans les principales suites collaboratives (La Suite Numérique, Microsoft 365, Google Workspace, etc.), la vérification en deux étapes est incluse — il suffit de l’activer dans les paramètres de sécurité, sans surcoût ni outil supplémentaire.`
      );
      expect(body.ordre).toBe(10);
      expect(body.risques).toHaveLength(3);
      expect(body.risques[0].libelle).toBe('Un compte utilise a votre place');
      expect(body.risques[1].libelle).toBe('Un acces non autorise a un outil en ligne');
      expect(body.risques[2].libelle).toBe('Connexion frauduleuse sans alerte');
      expect(body.liens).toHaveLength(1);
      expect(body.liens[0].libelle).toBe(
        'Guide ANSSI — Recommandations relatives à l’authentification multifacteur et aux mots de passe'
      );
    });

    it('renvoie les informations ReCyF de la mesure', async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      expect(body.exigences).toHaveLength(1);
      const exigence = body.exigences[0] as ExigenceNIS2;
      expect(exigence.reference).toBe('10.B.5-EI/EE');
      expect(exigence.entitesCible).toEqual(['EntiteEssentielle', 'EntiteImportante']);
      expect(exigence.objectifSecurite).toBe(
        'Objectif de sécurité 10: Gestion des identités et des accès des utilisateurs aux systèmes d’information'
      );
      expect(exigence.thematique).toBe('Authentification');
      expect(exigence.contenu).toBe('Les facteurs d’authentification...');
      expect(exigence.contenuEnAnglais).toBe('The authentication factors...');
    });

    it('réponds 404 si la mesure demandée est inconnue', async () => {
      const reponse = await request(serveur).get('/api/mesures/INCONNU.0').set('Cookie', cookieJeanneDupont);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('indique que la mesure a été prise en compte', async () => {
      const unUtilisateurAvecUnePriseEnCompte = utilisateurDeTest()
        .avecUneMesurePriseEnCompte(authentA2Etapes)
        .construis();

      const cookie = encodeSession({ email: unUtilisateurAvecUnePriseEnCompte.email, token: 'valide' });
      await entrepotUtilisateur.ajoute(unUtilisateurAvecUnePriseEnCompte);

      const { body } = await getConnecte(serveur, cookie);

      expect(body.estPriseEnCompte).toBe(true);
    });

    it('indique qu’une mesure n’a pas été prise en compte', async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      expect(body.estPriseEnCompte).toBe(false);
    });

    describe("lorsque qu'aucun utilisateur n'est connecté", async () => {
      it('réponds 401', async () => {
        const reponse = await request(serveur).get('/api/mesures/AUTH.5');

        expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
      });
    });

    it("renvoie l'id du module d'une mesure", async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      expect(body.idModule).toBe(3);
    });

    it("renvoie le nom du module d'une mesure", async () => {
      const { body } = await getConnecte(serveur, cookieJeanneDupont);

      expect(body.nomModule).toBe('Module 3');
    });
  });
});
