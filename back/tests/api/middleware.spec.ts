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

describe('Le middleware', () => {
  let requete: Request & { emailUtilisateurCourant?: string; };
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
      let contexteAvecErreur = new Context(['unChamp'], [], [], false, false);
      contexteAvecErreur.addError({
        type: 'field',
        message: "un message d'erreur",
        value: '',
        // @ts-ignore
        meta: {},
      });

      // @ts-ignore
      requete['express-validator#contexts'] = [contexteAvecErreur];

      await middleware.valide()(requete, reponse, () => {});

      assert.equal(reponse.statusCode, 400);
    });
  });

  describe('sur demande de validation du token JWT', () => {
    it("jette une erreur si le token n'est pas présent", async () => {
      let statutOriginal = reponse.status;
      let envOriginal = process.env;

      process.env.SECRET_JWT = 'monSecretJWT';
      const token = adaptateurJWT.genereToken({email: 'jeanne.dupont@beta.gouv.fr'});
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

    it("jette une erreur si le token ne peut pas être décodé", async () => {
      let statutOriginal = reponse.status;

      adaptateurJWT.decode = () => {
        throw new JsonWebTokenError('Erreur de token');
      }

      let statutRecu;
      reponse.sendStatus = (statut: number) => {
        statutRecu = statut;
        return statutOriginal(statut);
      };

      await middleware.verifieJWT(requete, reponse, () => {});

      assert.equal(statutRecu, 401);
    })

    it("ajoute l'email de l'utilisateur courant dans la requête", async () => {
      adaptateurJWT.decode = () => {
        return { email: 'jeanne.dupond@beta.gouv.fr'}
      }
      requete.session = {
        token: 'unToken'
      }

      await middleware.verifieJWT(requete, reponse, () => {});
      assert.equal(requete.emailUtilisateurCourant, 'jeanne.dupond@beta.gouv.fr');
    });
  });
});
