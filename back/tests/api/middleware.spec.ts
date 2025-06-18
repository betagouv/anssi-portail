import { beforeEach, describe, it } from 'node:test';
import { Request, Response } from 'express';
import { fabriqueMiddleware, Middleware } from '../../src/api/middleware';
import assert from 'assert';
import { createRequest, createResponse } from 'node-mocks-http';
import { OutgoingHttpHeaders } from 'node:http';
import { Context } from 'express-validator/lib/context';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import {
  fauxAdaptateurEnvironnement,
  fauxAdaptateurHachage,
  fauxAdaptateurJWT,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { JsonWebTokenError } from 'jsonwebtoken';
import { join } from 'path';
import { FournisseurChemin } from '../../src/api/fournisseurChemin';
import { jeanneDupont } from './objetsPretsALEmploi';
import { Utilisateur } from '../../src/metier/utilisateur';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';

describe('Le middleware', () => {
  let requete: Request & {
    emailUtilisateurCourant?: string;
    utilisateur?: Utilisateur | undefined;
  };
  let reponse: Response;
  let middleware: Middleware;
  let adaptateurJWT: AdaptateurJWT;
  let fournisseurChemin: FournisseurChemin;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;
  let adaptateurEnvironnement: AdaptateurEnvironnement;

  beforeEach(() => {
    adaptateurJWT = fauxAdaptateurJWT;
    requete = createRequest();
    reponse = createResponse();
    reponse.sendFileAvecNonce = () => reponse;
    fournisseurChemin = { ...fauxFournisseurDeChemin };
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    adaptateurEnvironnement = { ...fauxAdaptateurEnvironnement };
    middleware = fabriqueMiddleware({
      adaptateurJWT,
      fournisseurChemin,
      adaptateurEnvironnement,
    });
  });

  describe("sur demande d'aseptisation", () => {
    it('supprime les espaces au début et à la fin du paramètre', async () => {
      requete.body.param = '  une valeur ';
      let valeurAseptisee;
      const suite = () => (valeurAseptisee = requete.body.param);

      await middleware.aseptise('param')(requete, reponse, suite);

      assert.equal(valeurAseptisee, 'une valeur');
    });

    it('prend en compte plusieurs paramètres', async () => {
      requete.body.paramRenseigne = '  une valeur ';
      let valeurAseptisee;
      const suite = () => (valeurAseptisee = requete.body.paramRenseigne);

      await middleware.aseptise('paramAbsent', 'paramRenseigne')(
        requete,
        reponse,
        suite
      );

      assert.equal(valeurAseptisee, 'une valeur');
    });

    it('neutralise le code HTML', async () => {
      requete.body.paramRenseigne = '<script>alert("hacked!");</script>';
      const suite = () => (paramRenseigne = requete.body.paramRenseigne);
      let paramRenseigne;

      await middleware.aseptise('paramRenseigne')(requete, reponse, suite);

      assert.equal(
        paramRenseigne,
        '&lt;script&gt;alert(&quot;hacked!&quot;);&lt;&#x2F;script&gt;'
      );
    });

    it('aseptise les paramètres de la requête', async () => {
      requete.params.paramRenseigne = '<script>alert("hacked!");</script>';
      const suite = () => (paramRenseigne = requete.params.paramRenseigne);
      let paramRenseigne;

      await middleware.aseptise('paramRenseigne')(requete, reponse, suite);

      assert.equal(
        paramRenseigne,
        '&lt;script&gt;alert(&quot;hacked!&quot;);&lt;&#x2F;script&gt;'
      );
    });
  });

  describe("sur demande d'interdiction de mise en cache", () => {
    it('interdit la mise en cache', async () => {
      let headers: OutgoingHttpHeaders = {};
      const suite = () => {
        headers = reponse.getHeaders();
      };
      await middleware.interdisLaMiseEnCache(requete, reponse, suite);

      assert.equal(
        headers['cache-control'],
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      assert.equal(headers.pragma, 'no-cache');
      assert.equal(headers.expires, '0');
      assert.equal(headers['surrogate-control'], 'no-store');
    });
  });

  describe('sur demande de validation', () => {
    it('jette une 400 si une erreur de validation est présente', async () => {
      requete.body.param = 'hello';
      const contexteAvecErreur = new Context(['unChamp'], [], [], false, false);
      contexteAvecErreur.addError({
        type: 'field',
        message: "un message d'erreur",
        value: '',
        // @ts-expect-error (on n'a pas besoin de la valeur meta dans le cas de notre test)
        meta: {},
      });

      // @ts-expect-error (on sait que express-validator#contexts existe)
      requete['express-validator#contexts'] = [contexteAvecErreur];

      await middleware.valide()(requete, reponse, () => {});

      assert.equal(reponse.statusCode, 400);
    });
  });

  describe('sur demande de validation du token JWT', () => {
    it("jette une erreur si le token n'est pas présent", async () => {
      const statutOriginal = reponse.status;
      const envOriginal = process.env;

      process.env.SECRET_JWT = 'monSecretJWT';
      const token = adaptateurJWT.genereToken({
        email: 'jeanne.dupont@beta.gouv.fr',
      });
      requete.session = { token };

      let statutRecu;
      reponse.sendStatus = (statut: number) => {
        statutRecu = statut;
        return statutOriginal(statut);
      };

      await middleware.verifieJWT(requete, reponse, () => {});

      assert.equal(statutRecu, 401);

      process.env = envOriginal;
    });

    it('jette une erreur si le token ne peut pas être décodé', async () => {
      const statutOriginal = reponse.status;

      adaptateurJWT.decode = () => {
        throw new JsonWebTokenError('Erreur de token');
      };
      requete.session = {
        token: 'unToken',
      };

      let statutRecu;
      reponse.sendStatus = (statut: number) => {
        statutRecu = statut;
        return statutOriginal(statut);
      };

      await middleware.verifieJWT(requete, reponse, () => {});

      assert.equal(statutRecu, 401);
    });

    it("ajoute l'email de l'utilisateur courant dans la requête", async () => {
      adaptateurJWT.decode = () => {
        return { email: 'jeanne.dupond@beta.gouv.fr' };
      };
      requete.session = {
        token: 'unToken',
      };

      await middleware.verifieJWT(requete, reponse, () => {});
      assert.equal(
        requete.emailUtilisateurCourant,
        'jeanne.dupond@beta.gouv.fr'
      );
    });
  });

  describe('sur demande de validation du token JWT en cas de navigation', () => {
    it("redirige vers la page de connexion si le token n'est pas présent", async () => {
      let urlRecu;
      // @ts-expect-error (on sait que redirect va être appelé avec une URL et pas un code HTTP dans ce cas)
      reponse.redirect = (url: string) => {
        urlRecu = url;
        return;
      };

      await middleware.verifieJWTNavigation(requete, reponse, () => {});

      assert.equal(urlRecu, '/connexion');
    });

    it('redirige vers la page de connexion si le token ne peut pas être décodé', async () => {
      adaptateurJWT.decode = () => {
        throw new JsonWebTokenError('Erreur de token');
      };
      requete.session = {
        token: 'unToken',
      };

      let urlRecu;
      // @ts-expect-error (on sait que redirect va être appelé avec une URL et pas un code HTTP dans ce cas)
      reponse.redirect = (url: string) => {
        urlRecu = url;
        return;
      };

      await middleware.verifieJWTNavigation(requete, reponse, () => {});

      assert.equal(urlRecu, '/connexion');
    });
  });

  describe("sur demande d'ajout de la méthode sendFileAvecNonce", () => {
    it('permet de substituer la variable du nonce par une valeur aléatoire', async () => {
      const leVraiSend = reponse.send;
      let aAppeleSend = false;
      reponse.send = (contenu: string) => {
        aAppeleSend = true;
        assert.match(contenu, /<script nonce="[a-zA-Z0-9+/]{22}=="/);
        return leVraiSend(contenu);
      };

      await middleware.ajouteMethodeNonce(requete, reponse, () => {
        assert.notEqual(reponse.sendFileAvecNonce, undefined);
        reponse.sendFileAvecNonce(
          join(process.cwd(), 'tests', 'ressources', 'factice.html')
        );
      });

      assert.equal(true, aAppeleSend);
    });

    it("renvoi un 404 si la fichier n'existe pas", async () => {
      let pagesDemandee: string = '';
      fournisseurChemin.ressourceDeBase = (nomPage) => {
        pagesDemandee = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await middleware.ajouteMethodeNonce(requete, reponse, () => {
        assert.notEqual(reponse.sendFileAvecNonce, undefined);
        reponse.sendFileAvecNonce('/services/inexistant.html');
      });

      assert.deepEqual(pagesDemandee, '404.html');
    });
  });

  describe("sur demande d'ajout de l'utilisateur courant", () => {
    let adaptateurHachage: AdaptateurHachage;
    beforeEach(() => {
      adaptateurHachage = fauxAdaptateurHachage;
    });

    it("ajoute l'utilisateur dont l'email est dans la session à la requête", async () => {
      requete.session = { email: jeanneDupont.email };
      await entrepotUtilisateur.ajoute(jeanneDupont);

      await middleware.ajouteUtilisateurARequete(
        entrepotUtilisateur,
        adaptateurHachage
      )(requete, reponse, () => {});

      assert.deepEqual(requete.utilisateur, jeanneDupont);
    });

    it('est indéfini si non défini dans la session', async () => {
      requete.session = {};
      await entrepotUtilisateur.ajoute(jeanneDupont);

      await middleware.ajouteUtilisateurARequete(
        entrepotUtilisateur,
        adaptateurHachage
      )(requete, reponse, () => {});

      assert.equal(requete.utilisateur, undefined);
    });

    it('appelle la suite', async () => {
      let suiteAppelee = false;

      await middleware.ajouteUtilisateurARequete(
        entrepotUtilisateur,
        adaptateurHachage
      )(requete, reponse, () => {
        suiteAppelee = true;
      });

      assert.equal(suiteAppelee, true);
    });

    it("n'essaie pas de hacher si l'email est absent", async () => {
      requete.session = {};
      adaptateurHachage.hache = (_) => {
        throw new Error();
      };
      let suiteAppelee = false;

      await middleware.ajouteUtilisateurARequete(
        entrepotUtilisateur,
        adaptateurHachage
      )(requete, reponse, () => {
        suiteAppelee = true;
      });

      assert.equal(suiteAppelee, true);
    });

    it("renvoie une erreur 500 lorque l'entrepôt ne fonctionne pas", async () => {
      requete.session = { email: jeanneDupont.email };
      entrepotUtilisateur.echoueSurRechercheParMail();
      let suiteAppelee = false;

      await middleware.ajouteUtilisateurARequete(
        entrepotUtilisateur,
        adaptateurHachage
      )(requete, reponse, () => {
        suiteAppelee = true;
      });

      assert.equal(reponse.statusCode, 500);
      assert.equal(suiteAppelee, false);
    });
  });

  describe('sur vérification du mode maintenance', () => {
    it('affiche la page de maintenance lorsque le mode est actif', async () => {
      adaptateurEnvironnement.maintenance = () => ({
        actif: () => true,
      });
      let pageDemandee: string = '';
      fournisseurChemin.ressourceDeBase = (nomPage) => {
        pageDemandee = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await middleware.verifieModeMaintenance(requete, reponse, () => {});

      assert.equal(reponse.statusCode, 503);
      assert.equal(pageDemandee, 'maintenance.html');
    });

    it('appelle la suite lorsque le mode est inactif', async () => {
      adaptateurEnvironnement.maintenance = () => ({
        actif: () => false,
      });
      let suiteAppelee = false;

      await middleware.verifieModeMaintenance(requete, reponse, () => {
        suiteAppelee = true;
      });

      assert.equal(suiteAppelee, true);
    });
  });
});
