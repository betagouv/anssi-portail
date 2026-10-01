import { beforeEach, describe, expect, it } from 'vitest';
import {
  AdaptateurEnrichissement,
  fabriqueAdaptateurEnrichissement,
} from '../../../src/infra/enrichissement/adaptateurEnrichissement.js';
import { fauxAdaptateurEnvironnement, fauxFournisseurDeChemin } from '../../api/fauxObjets.js';
import { financementCyberPME, guideDevsecops } from '../../api/objetsPretsALEmploi.js';
import { EntrepôtArticleMémoire } from '../../persistance/entrepotArticleMemoire.js';
import { EntrepotExigenceMemoire } from '../../persistance/entrepotExigenceMemoire.js';
import { EntrepotFinancementMemoire } from '../../persistance/entrepotFinancementMemoire.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';

describe("L'adaptateur qui enrichie le html servi", () => {
  let adaptateurEnrichissement: AdaptateurEnrichissement;
  let entrepôtGuide: EntrepotGuideMemoire;
  let entrepôtFinancement: EntrepotFinancementMemoire;
  let entrepôtArticle: EntrepôtArticleMémoire;

  beforeEach(async () => {
    entrepôtGuide = new EntrepotGuideMemoire();
    entrepôtFinancement = new EntrepotFinancementMemoire();
    entrepôtArticle = new EntrepôtArticleMémoire();
    adaptateurEnrichissement = await fabriqueAdaptateurEnrichissement(
      fauxAdaptateurEnvironnement,
      fauxFournisseurDeChemin,
      entrepôtGuide,
      new EntrepotExigenceMemoire(),
      entrepôtFinancement,
      entrepôtArticle
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

      expect(rendu).toMatch(/<link rel="canonical" href="http:\/\/localhost:3000\/financements\/1">/);
    });

    it("lorsqu'on sert une page de guide", async () => {
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/identifiant-dun-guide');

      expect(rendu).toMatch(/<link rel="canonical" href="http:\/\/localhost:3000\/guides\/identifiant-dun-guide">/);
    });

    it("lorsqu'on sert un article Crisp", async () => {
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/conseils-cyber');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(
        htmlFactice,
        '/conseils-cyber/slug-article-1'
      );

      expect(rendu).toMatch(/<link rel="canonical" href="http:\/\/localhost:3000\/conseils-cyber\/slug-article-1">/);
    });
  });

  describe('sait modifier le titre', () => {
    it("lorsqu'on sert une page de guide", async () => {
      await entrepôtGuide.ajoute(guideDevsecops());
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/devsecops');

      expect(rendu).toMatch(/<title>DevSecOps | MesServicesCyber<\/title>/);
    });

    it("lorsqu'on sert une page de financement", async () => {
      await entrepôtFinancement.ajoute(financementCyberPME);
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/financements');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/financements/1');

      expect(rendu).toMatch(/<title>Cyber PME | MesServicesCyber<\/title>/);
    });

    it("lorsqu'on sert un article Crisp", async () => {
      await entrepôtArticle.ajoute({ slug: 'slug-article-1', titre: "Le titre de l'article 1" });
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/conseils-cyber');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(
        htmlFactice,
        '/conseils-cyber/slug-article-1'
      );

      expect(rendu).toMatch(/<title>Le titre de l'article 1 | MesServicesCyber<\/title>/);
    });
  });
});
