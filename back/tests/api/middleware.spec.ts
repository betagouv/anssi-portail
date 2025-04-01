import { beforeEach, describe, it } from 'node:test';
import { Request, Response } from 'express';
import { fabriqueMiddleware, Middleware } from '../../src/api/middleware';
import assert from 'assert';
import { createRequest, createResponse } from 'node-mocks-http';
import { OutgoingHttpHeaders } from 'node:http';
import { Context } from 'express-validator/lib/context';
import { AdaptateurJWT } from '../../src/api/adaptateurJWT';
import { fauxAdaptateurJWT } from './fauxObjets';
import { JsonWebTokenError } from 'jsonwebtoken';
import { join } from 'path';

describe('Le middleware', () => {
  let requete: Request & { emailUtilisateurCourant?: string };
  let reponse: Response;
  let middleware: Middleware;
  let adaptateurJWT: AdaptateurJWT;

  beforeEach(() => {
    adaptateurJWT = fauxAdaptateurJWT;
    requete = createRequest();
    reponse = createResponse();
    middleware = fabriqueMiddleware({ adaptateurJWT });
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
  });
});
