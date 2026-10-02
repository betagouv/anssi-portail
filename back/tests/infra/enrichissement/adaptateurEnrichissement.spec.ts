import { beforeEach, describe, expect, it } from 'vitest';
import {
  AdaptateurEnrichissement,
  fabriqueAdaptateurEnrichissement,
} from '../../../src/infra/enrichissement/adaptateurEnrichissement.js';
import { ConstructeurDArticleAvecToutesLesMétadonnées } from '../../api/blog/constructeurDeResumeDArticle.js';
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
    <meta name="description" content="description">
    <meta property="og:description" content="description">
    <meta property="og:title" content="titre">
    <meta property="og:url" content="${lienCanonique}">
    <meta name="twitter:description" content="description">
    <meta name="twitter:title" content="titre">
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
      expect(rendu).toMatch(/<meta property="og:url" content="http:\/\/localhost:3000\/financements\/1">/);
    });

    it("lorsqu'on sert une page de guide", async () => {
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/identifiant-dun-guide');

      expect(rendu).toMatch(/<link rel="canonical" href="http:\/\/localhost:3000\/guides\/identifiant-dun-guide">/);
      expect(rendu).toMatch(
        /<meta property="og:url" content="http:\/\/localhost:3000\/guides\/identifiant-dun-guide">/
      );
    });

    it("lorsqu'on sert un article Crisp", async () => {
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/conseils-cyber');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(
        htmlFactice,
        '/conseils-cyber/slug-article-1'
      );

      expect(rendu).toMatch(/<link rel="canonical" href="http:\/\/localhost:3000\/conseils-cyber\/slug-article-1">/);
      expect(rendu).toMatch(
        /<meta property="og:url" content="http:\/\/localhost:3000\/conseils-cyber\/slug-article-1">/
      );
    });
  });

  describe('sait modifier le titre', () => {
    it("lorsqu'on sert une page de guide", async () => {
      await entrepôtGuide.ajoute(guideDevsecops());
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/devsecops');

      expect(rendu).toMatch(/<title>DevSecOps | MesServicesCyber<\/title>/);
      expect(rendu).toMatch(/<meta property="og:title" content="DevSecOps | MesServicesCyber">/);
      expect(rendu).toMatch(/<meta name="twitter:title" content="DevSecOps | MesServicesCyber">/);
    });

    it("lorsqu'on sert une page de financement", async () => {
      await entrepôtFinancement.ajoute(financementCyberPME);
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/financements');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/financements/1');

      expect(rendu).toMatch(/<title>Cyber PME | MesServicesCyber<\/title>/);
      expect(rendu).toMatch(/<meta property="og:title" content="Cyber PME | MesServicesCyber">/);
      expect(rendu).toMatch(/<meta name="twitter:title" content="Cyber PME | MesServicesCyber">/);
    });

    it("lorsqu'on sert un article Crisp", async () => {
      const article = new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug('slug-article-1').construis();
      await entrepôtArticle.ajoute(article);
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/conseils-cyber');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(
        htmlFactice,
        '/conseils-cyber/slug-article-1'
      );

      expect(rendu).toMatch(/<title>Le titre de l'article 1 | MesServicesCyber<\/title>/);
      expect(rendu).toMatch(/<meta property="og:title" content="Le titre de l'article 1 | MesServicesCyber">/);
      expect(rendu).toMatch(/<meta name="twitter:title" content="Le titre de l'article 1 | MesServicesCyber">/);
    });
  });

  describe('sait modifier la description', () => {
    it("lorsqu'on sert une page de guide", async () => {
      await entrepôtGuide.ajoute(guideDevsecops());
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/guides');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/guides/devsecops');

      expect(rendu).toMatch(
        /<meta name="description" content="Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.">/
      );
      expect(rendu).toMatch(
        /<meta property="og:description" content="Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.">/
      );
      expect(rendu).toMatch(
        /<meta name="twitter:description" content="Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.">/
      );
    });

    it("lorsqu'on sert une page de financement", async () => {
      await entrepôtFinancement.ajoute(financementCyberPME);
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/financements');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(htmlFactice, '/financements/1');

      expect(rendu).toMatch(/<meta name="description" content="Cyber PME \(France\)">/);
      expect(rendu).toMatch(/<meta property="og:description" content="Cyber PME \(France\)">/);
      expect(rendu).toMatch(/<meta name="twitter:description" content="Cyber PME \(France\)">/);
    });

    it("lorsqu'on sert un article Crisp", async () => {
      const article = new ConstructeurDArticleAvecToutesLesMétadonnées()
        .avecLeSlug('slug-article-1')
        .avecLaDescription("La description de l'article 1")
        .construis();
      await entrepôtArticle.ajoute(article);
      const htmlFactice = fabriqueHtmlFactice('http://localhost:3000/conseils-cyber');

      const rendu = await adaptateurEnrichissement.enrichisAvecComposants(
        htmlFactice,
        '/conseils-cyber/slug-article-1'
      );

      expect(rendu).toMatch(/<meta name="description" content="La description de l'article 1">/);
      expect(rendu).toMatch(/<meta property="og:description" content="La description de l'article 1">/);
      expect(rendu).toMatch(/<meta name="twitter:description" content="La description de l'article 1">/);
    });
  });
});
