import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ErreurTraverséeDeChemin } from '../../src/api/erreurs.js';
import {
  construisListeFichiersDuSite,
  FichierInconnu,
  fournisseurChemin,
  siteFront,
} from '../../src/api/fournisseurChemin.js';

describe('le fournisseurChemin', () => {
  describe("lorsqu'on récupère un fichier", () => {
    it('rejette ../etc/passwd', () => {
      assert.throws(
        () => fournisseurChemin.jekyll.page('../etc/passwd'),
        (err) => err instanceof ErreurTraverséeDeChemin && /Tentative de path traversal/.test(err.message)
      );
    });

    it('rejette ..%2fetc%2fpasswd (URL-encoded)', () => {
      assert.throws(
        () => fournisseurChemin.jekyll.page('..%2fetc%2fpasswd'),
        (err) => err instanceof ErreurTraverséeDeChemin && /Tentative de path traversal/.test(err.message)
      );
    });

    it('rejette ../../etc/passwd', () => {
      assert.throws(
        () => fournisseurChemin.jekyll.page('../../etc/passwd'),
        (err) => err instanceof ErreurTraverséeDeChemin && /Tentative de path traversal/.test(err.message)
      );
    });

    it('accepte index', () => {
      siteFront.fichiers = () => [`${process.cwd()}/front/_site/index/index.html`];

      assert.doesNotThrow(() => fournisseurChemin.jekyll.page('index'));
    });

    it('refuse un fichier qui ne se trouve pas dans le site', () => {
      siteFront.fichiers = () => [];

      assert.throws(
        () => fournisseurChemin.jekyll.page('inconnue'),
        (err) => err instanceof FichierInconnu && /Fichier inconnu .*_site\/inconnue\/index\.html/.test(err.message)
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
