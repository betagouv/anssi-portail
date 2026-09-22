import { describe, expect, it } from 'vitest';
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
      expect(() => fournisseurChemin.jekyll.page('../etc/passwd')).toThrow(
        expect.objectContaining({
          constructor: ErreurTraverséeDeChemin,
          message: expect.stringMatching(/Tentative de path traversal/),
        })
      );
    });

    it('rejette ..%2fetc%2fpasswd (URL-encoded)', () => {
      expect(() => fournisseurChemin.jekyll.page('..%2fetc%2fpasswd')).toThrow(
        expect.objectContaining({
          constructor: ErreurTraverséeDeChemin,
          message: expect.stringMatching(/Tentative de path traversal/),
        })
      );
    });

    it('rejette ../../etc/passwd', () => {
      expect(() => fournisseurChemin.jekyll.page('../../etc/passwd')).toThrow(
        expect.objectContaining({
          constructor: ErreurTraverséeDeChemin,
          message: expect.stringMatching(/Tentative de path traversal/),
        })
      );
    });

    it('accepte index', () => {
      siteFront.fichiers = () => [`${process.cwd()}/front/_site/index/index.html`];

      expect(() => fournisseurChemin.jekyll.page('index')).not.toThrow();
    });

    it('résout une URL de ressource sans extension vers le fichier HTML', () => {
      const chemin = `${process.cwd()}/front/_site/ressources/cyber-enjeux-pro.html`;
      siteFront.fichiers = () => [chemin];

      expect(fournisseurChemin.jekyll.ressource('cyber-enjeux-pro')).toBe(chemin);
    });

    it('résout une URL de service sans extension vers le fichier HTML', () => {
      const chemin = `${process.cwd()}/front/_site/services/demainspecialistecyber.html`;
      siteFront.fichiers = () => [chemin];

      expect(fournisseurChemin.jekyll.service('demainspecialistecyber')).toBe(chemin);
    });

    it('résout une URL de contact sans extension vers le fichier HTML', () => {
      const chemin = `${process.cwd()}/front/_site/contacts/FR-IDF.html`;
      siteFront.fichiers = () => [chemin];

      expect(fournisseurChemin.jekyll.contact('FR-IDF')).toBe(chemin);
    });

    it('refuse un fichier qui ne se trouve pas dans le site', () => {
      siteFront.fichiers = () => [];

      expect(() => fournisseurChemin.jekyll.page('inconnue')).toThrow(
        expect.objectContaining({
          constructor: FichierInconnu,
          message: expect.stringMatching(/Fichier inconnu .*_site\/inconnue\/index\.html/),
        })
      );
    });
  });

  describe('sur construction de la liste des fichiers autorisés', () => {
    it('retourne la liste des fichiers', () => {
      const fichiers = construisListeFichiersDuSite('tests/ressources/_site');

      expect(fichiers[0]).toBe(`${process.cwd()}/tests/ressources/_site/contacts`);
      expect(fichiers[1]).toBe(`${process.cwd()}/tests/ressources/_site/contacts/index.html`);
    });
  });
});
