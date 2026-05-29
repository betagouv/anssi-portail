import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fournisseurChemin } from '../../src/api/fournisseurChemin';
import { PathTraversalError } from '../../src/api/erreurs';

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
});
