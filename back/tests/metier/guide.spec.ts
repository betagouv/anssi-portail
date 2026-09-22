import { beforeEach, describe, expect, it } from 'vitest';
import { guideZeroTrust } from '../api/objetsPretsALEmploi.js';
import { EntrepotGuideTravailMemoire } from '../persistance/entrepotGuideTravailMemoire.js';

describe('Le guide', () => {
  describe("lorsqu'on sauvegarde", () => {
    const guideOriginal = guideZeroTrust();
    let fauxEntrepot = new EntrepotGuideTravailMemoire();

    beforeEach(async () => {
      fauxEntrepot = new EntrepotGuideTravailMemoire();
      await fauxEntrepot.ajoute(guideOriginal);
    });
    it("délègue la persistance à l'entrepôt avec les bonnes données", async () => {
      const nouveuGuide = guideZeroTrust();
      nouveuGuide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];
      nouveuGuide.nomsAnciensDocuments = ['ancien.pdf'];

      await nouveuGuide.sauvegarde(fauxEntrepot);
      const guidePersiste = await fauxEntrepot.parId(nouveuGuide.id);

      expect(guidePersiste?.listeDocuments).toEqual([{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }]);
      expect(guidePersiste?.nomsAnciensDocuments).toEqual(['ancien.pdf']);
    });
  });

  describe("lorsqu'on supprime un document", () => {
    it('retire le document de listeDocuments', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];

      guide.supprimeLeDocument('mon-document.pdf');

      expect(guide.listeDocuments).toHaveLength(0);
    });

    it('le guide ne possède plus le document après suppression', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];

      guide.supprimeLeDocument('mon-document.pdf');

      expect(guide.possedeLeDocument('mon-document.pdf')).toBe(false);
    });

    it('ajoute le nomFichier aux anciens documents', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];

      guide.supprimeLeDocument('mon-document.pdf');

      expect(guide.nomsAnciensDocuments).toEqual(['mon-document.pdf']);
    });

    it("n'ajoute pas le nom du document aux anciens documents si celui ci n'existe pas", () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [];

      guide.supprimeLeDocument('inexistant.pdf');

      expect(guide.nomsAnciensDocuments).toEqual([]);
    });

    it('ne retire pas les autres documents', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [
        { libelle: 'Document A', nomFichier: 'document-a.pdf' },
        { libelle: 'Document B', nomFichier: 'document-b.pdf' },
      ];

      guide.supprimeLeDocument('document-a.pdf');

      expect(guide.listeDocuments).toHaveLength(1);
      expect(guide.listeDocuments[0].nomFichier).toBe('document-b.pdf');
    });
  });

  describe('lorsqu’on ajoute un document', () => {
    it('le supprime de la liste des anciens documents', () => {
      const guide = guideZeroTrust();
      guide.nomsAnciensDocuments = ['mon-document.pdf'];

      guide.ajouteLeDocument({ libelle: 'Mon document', nomFichier: 'mon-document.pdf' });

      expect(guide.nomsAnciensDocuments).toEqual([]);
    });
  });
});
