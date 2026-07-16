import { describe, it } from 'node:test';
import { fabriqueAdaptateurEnrichissement } from '../../../src/infra/enrichissement/adaptateurEnrichissement.js';
import { fauxAdaptateurEnvironnement, fauxFournisseurDeChemin } from '../../api/fauxObjets.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire.js';
import assert from 'node:assert';

describe("L'adaptateur qui enrichie le html servi", () => {
  describe('sait faire le lien canonique', () => {
    it("lorsqu'on sert une page financement", async () => {
      const adaptateurEnrichissement = await fabriqueAdaptateurEnrichissement(
        fauxAdaptateurEnvironnement,
        fauxFournisseurDeChemin,
        new EntrepotGuideMemoire(),
        new EntrepotExigenceMemoire()
      );

      const htmlFactice = `
<!doctype html>
<html lang="en">
  <head>
    <link rel="canonical" href="http://localhost:3000/financements">
    <title>titre</title>
    <link nonce="%%NONCE%%" />
  </head>
  <body>
    Ce fichier est utilisé pour renvoyer un contenu HTML factice pour les tests.
    <script nonce="%%NONCE%%"></script>
    <script src="/un-script.js?version=%%VERSION%%"></script>
  </body>
</html>
      `;

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/financements/1');
      assert.match(rendu, /<link rel="canonical" href="http:\/\/localhost:3000\/financements\/1">/);
    });

    it("lorsqu'on sert une page de guide", async () => {
      const adaptateurEnrichissement = await fabriqueAdaptateurEnrichissement(
        fauxAdaptateurEnvironnement,
        fauxFournisseurDeChemin,
        new EntrepotGuideMemoire(),
        new EntrepotExigenceMemoire()
      );

      const htmlFactice = `
<!doctype html>
<html lang="en">
  <head>
    <link rel="canonical" href="http://localhost:3000/guides">
    <title>titre</title>
    <link nonce="%%NONCE%%" />
  </head>
  <body>
    Ce fichier est utilisé pour renvoyer un contenu HTML factice pour les tests.
    <script nonce="%%NONCE%%"></script>
    <script src="/un-script.js?version=%%VERSION%%"></script>
  </body>
</html>
      `;

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/identifiant-dun-guide');
      assert.match(rendu, /<link rel="canonical" href="http:\/\/localhost:3000\/guides\/identifiant-dun-guide">/);
    });
  });
});
