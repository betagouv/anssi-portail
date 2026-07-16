import { beforeEach, describe, it } from 'node:test';
import {
  AdaptateurEnrichissement,
  fabriqueAdaptateurEnrichissement,
} from '../../../src/infra/enrichissement/adaptateurEnrichissement.js';
import { fauxAdaptateurEnvironnement, fauxFournisseurDeChemin } from '../../api/fauxObjets.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire.js';
import assert from 'node:assert';
import { guideDevsecops } from '../../api/objetsPretsALEmploi.js';
import { EntrepotFinancementMemoire } from '../../persistance/entrepotFinancementMemoire.js';

describe("L'adaptateur qui enrichie le html servi", () => {
  let adaptateurEnrichissement: AdaptateurEnrichissement;
  let entrepôtGuide: EntrepotGuideMemoire;

  beforeEach(async () => {
    entrepôtGuide = new EntrepotGuideMemoire();
    adaptateurEnrichissement = await fabriqueAdaptateurEnrichissement(
      fauxAdaptateurEnvironnement,
      fauxFournisseurDeChemin,
      entrepôtGuide,
      new EntrepotExigenceMemoire(),
      new EntrepotFinancementMemoire()
    );
  });

  const fabriqueHtmlFactice = (lienCanonique: string) => {
    return `
<!doctype html>
<html lang="en">
  <head>
    <link rel="canonical" href="${lienCanonique}">
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
  };

  describe('sait modifier le lien canonique', () => {
    it("lorsqu'on sert une page financement", async () => {
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/financements');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/financements/1');

      assert.match(rendu, /<link rel="canonical" href="http:\/\/localhost:3000\/financements\/1">/);
    });

    it("lorsqu'on sert une page de guide", async () => {
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/identifiant-dun-guide');

      assert.match(rendu, /<link rel="canonical" href="http:\/\/localhost:3000\/guides\/identifiant-dun-guide">/);
    });
  });

  describe('sait modifier le titre', () => {
    it("lorsqu'on sert une page de guide", async () => {
      await entrepôtGuide.ajoute(guideDevsecops());
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/devsecops');

      assert.match(rendu, /<title>DevSecOps | MesServicesCyber<\/title>/);
    });
  });
});
