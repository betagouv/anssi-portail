import assert from 'node:assert';
import { describe, it } from 'node:test';
import { PathTraversalError } from '../../src/api/erreurs';
import { construisListeFichiersDuSite, fournisseurChemin } from '../../src/api/fournisseurChemin';

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
      assert.doesNotThrow(() => fournisseurChemin.cheminProduitJekyll('produits', 'produit-securite'));
    });

    it('accepte index', () => {
      assert.doesNotThrow(() => fournisseurChemin.cheminPageJekyll('index'));
    });

    it('accepte mon-espace-nis2.html', () => {
      assert.doesNotThrow(() => fournisseurChemin.ressourceDeBase('mon-espace-nis2.html'));
    });

    it('accepte css/style.css', () => {
      assert.doesNotThrow(() => fournisseurChemin.ressourceDeBase('css/style.css'));
    });
  });

  describe('sur construction de la liste des fichiers autorisés', () => {
    it('retourne la liste des fichiers', async () => {
      const fichiers = await construisListeFichiersDuSite('tests/ressources/_site');

      assert.equal(fichiers[0], `${process.cwd()}/tests/ressources/_site/contacts`);
      assert.equal(fichiers[1], `${process.cwd()}/tests/ressources/_site/contacts/index.html`);
    });
  });
});
