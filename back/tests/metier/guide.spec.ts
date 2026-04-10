import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { guideZeroTrust } from '../api/objetsPretsALEmploi';
import { EntrepotGuideTravailMemoire } from '../persistance/entrepotGuideTravailMemoire';

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

      assert.deepEqual(guidePersiste?.listeDocuments, [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }]);
      assert.deepEqual(guidePersiste?.nomsAnciensDocuments, ['ancien.pdf']);
    });
  });

  describe("lorsqu'on supprime un document", () => {
    it('retire le document de listeDocuments', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];

      guide.supprimeLeDocument('mon-document.pdf');

      assert.equal(guide.listeDocuments.length, 0);
    });

    it('le guide ne possède plus le document après suppression', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];

      guide.supprimeLeDocument('mon-document.pdf');

      assert.equal(guide.possedeLeDocument('mon-document.pdf'), false);
    });

    it('ajoute le nomFichier aux anciens documents', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [{ libelle: 'Mon document', nomFichier: 'mon-document.pdf' }];

      guide.supprimeLeDocument('mon-document.pdf');

      assert.deepEqual(guide.nomsAnciensDocuments, ['mon-document.pdf']);
    });

    it("n'ajoute pas le nom du document aux anciens documents si celui ci n'existe pas", () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [];

      guide.supprimeLeDocument('inexistant.pdf');

      assert.deepEqual(guide.nomsAnciensDocuments, []);
    });

    it('ne retire pas les autres documents', () => {
      const guide = guideZeroTrust();
      guide.listeDocuments = [
        { libelle: 'Document A', nomFichier: 'document-a.pdf' },
        { libelle: 'Document B', nomFichier: 'document-b.pdf' },
      ];

      guide.supprimeLeDocument('document-a.pdf');

      assert.equal(guide.listeDocuments.length, 1);
      assert.equal(guide.listeDocuments[0].nomFichier, 'document-b.pdf');
    });
  });
});
