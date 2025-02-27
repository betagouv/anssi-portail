import { beforeEach, describe, it } from 'node:test';
import { Request, Response } from 'express';
import { fabriqueMiddleware, Middleware } from '../../src/api/middleware';
import assert from 'assert';
import { createRequest, createResponse } from 'node-mocks-http';

describe('Le middleware', () => {
  let requete: Request & { service?: string };
  let reponse: Response;
  let middleware: Middleware;

  beforeEach(() => {
    requete = createRequest();
    reponse = createResponse();
    middleware = fabriqueMiddleware();
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
});
