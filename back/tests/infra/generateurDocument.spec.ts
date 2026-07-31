import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { ErreurDeSyntaxe, generateurDocument } from '../../src/infra/generateurDocument.js';
import { typstFactice } from '../api/fauxObjets.js';

const estUnPdf = (buffer: Buffer): boolean => {
  if (buffer.length < 5) {
    return false;
  }
  return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
};

describe('Le générateur de document', () => {
  const extraitLeTexte = async (document: PDFDocumentProxy, numeroPage: number = 1) => {
    const page = await document.getPage(numeroPage);
    const contenu = await page.getTextContent();
    return contenu.items
      .filter((mot) => 'str' in mot)
      .map((mot) => mot.str)
      .join(' ');
  };

  it("sait générer un pdf à partir d'un contenu fichier", async () => {
    const document = await generateurDocument({ contenuFichier: '$ a arrow.squiggly b $' });

    assert.equal(estUnPdf(document!), true);
  });

  it('sait générer un pdf qui contient le texte attendu', async () => {
    const document = await generateurDocument({ contenuFichier: 'Hello World!' });
    const documentPdf = await getDocument({
      data: new Uint8Array(document!),
    }).promise;

    const texte = await extraitLeTexte(documentPdf);

    assert.equal(texte.includes('Hello World!'), true);
  });

  it('déclenche une erreur si la syntaxe est mauvaise', async () => {
    await assert.rejects(
      async () => await generateurDocument({ contenuFichier: '##' }),
      (erreur) => erreur instanceof ErreurDeSyntaxe
    );
  });

  it("sait générer un pdf à partir d'un chemin fichier", async () => {
    const document = await generateurDocument({ cheminFichier: typstFactice() });

    assert.equal(estUnPdf(document!), true);
  });
});
