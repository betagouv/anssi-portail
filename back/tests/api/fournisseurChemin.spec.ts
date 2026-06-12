import assert from 'node:assert';
import { describe, it } from 'node:test';
import { PathTraversalError } from '../../src/api/erreurs';
import { construisListeFichiersDuSite, fournisseurChemin, siteFront } from '../../src/api/fournisseurChemin';

describe('le fournisseurChemin', () => {
  describe("lorsqu'on récupère un fichier", () => {
    it('rejette ../etc/passwd', () => {
      assert.throws(
        () => fournisseurChemin.cheminProduitJekyll('produits', '../etc/passwd'),
        (err) => err instanceof PathTraversalError && /Tentative de path traversal/.test(err.message)
      );
    });

    it('rejette ..%2fetc%2fpasswd (URL-encoded)', () => {
      assert.throws(
        () => fournisseurChemin.cheminProduitJekyll('produits', '..%2fetc%2fpasswd'),
        (err) => err instanceof PathTraversalError && /Tentative de path traversal/.test(err.message)
      );
    });

    it('rejette ../../etc/passwd', () => {
      assert.throws(
        () => fournisseurChemin.cheminProduitJekyll('produits', '../../etc/passwd'),
        (err) => err instanceof PathTraversalError && /Tentative de path traversal/.test(err.message)
      );
    });

    it('rejette /etc/passwd (chemin absolu)', () => {
      assert.throws(
        () => fournisseurChemin.ressourceDeBase('/etc/passwd'),
        (err) => err instanceof PathTraversalError && /Tentative de path traversal/.test(err.message)
      );
    });

    it('rejette \\etc\\passwd (chemin absolu Windows)', () => {
      assert.throws(
        () => fournisseurChemin.cheminPageJekyll('\\etc\\passwd'),
        (err) => err instanceof PathTraversalError && /Tentative de path traversal/.test(err.message)
      );
    });

    it('accepte produit-securite', () => {
      siteFront.fichiers = () => [`${process.cwd()}/front/_site/produits/produit-securite`];

      assert.doesNotThrow(() => fournisseurChemin.cheminProduitJekyll('produits', 'produit-securite'));
    });

    it('accepte index', () => {
      siteFront.fichiers = () => [`${process.cwd()}/front/_site/index/index.html`];

      assert.doesNotThrow(() => fournisseurChemin.cheminPageJekyll('index'));
    });

    it('accepte mon-espace-nis2.html', () => {
      siteFront.fichiers = () => [`${process.cwd()}/front/_site/mon-espace-nis2.html`];

      assert.doesNotThrow(() => fournisseurChemin.ressourceDeBase('mon-espace-nis2.html'));
    });

    it('accepte css/style.css', () => {
      siteFront.fichiers = () => [`${process.cwd()}/front/_site/css/style.css`];

      assert.doesNotThrow(() => fournisseurChemin.ressourceDeBase('css/style.css'));
    });

    it('refuse un fichier qui ne se trouve pas dans le site', () => {
      siteFront.fichiers = () => [];

      assert.throws(
        () => fournisseurChemin.cheminPageJekyll('inconnue'),
        (err) => err instanceof Error && /Fichier inconnu/.test(err.message)
      );
    });
  });

  describe('sur construction de la liste des fichiers autorisés', () => {
    it('retourne la liste des fichiers', () => {
      const fichiers = construisListeFichiersDuSite('tests/ressources/_site');

      assert.equal(fichiers[0], `${process.cwd()}/tests/ressources/_site/contacts`);
      assert.equal(fichiers[1], `${process.cwd()}/tests/ressources/_site/contacts/index.html`);
    });
  });
});
