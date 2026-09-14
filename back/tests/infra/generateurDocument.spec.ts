import { Canvas } from '@napi-rs/canvas';
import { readFile } from 'node:fs/promises';
import { describe, it, expect } from 'vitest';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import sharp from 'sharp';
import { ErreurTypst, generateurDocument } from '../../src/infra/generateurDocument.js';
import { fauxFournisseurDeChemin, typstFactice } from '../api/fauxObjets.js';

const estUnPdf = (buffer: Buffer): boolean => {
  if (buffer.length < 5) {
    return false;
  }
  return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
};

const rasterisePremierePage = async (pdfBuffer: Buffer) => {
  const pdf = await getDocument({ data: new Uint8Array(pdfBuffer) }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = new Canvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  await page.render({
    canvas: canvas as unknown as HTMLCanvasElement,
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise;

  return canvas.toBuffer('image/png');
};

const pixels = async (png: Buffer) => sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

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

    expect(estUnPdf(document!)).toBe(true);
  });

  it('sait générer un pdf qui contient le texte attendu', async () => {
    const document = await generateurDocument({ contenuFichier: 'Hello World!' });
    const documentPdf = await getDocument({
      data: new Uint8Array(document!),
    }).promise;

    const texte = await extraitLeTexte(documentPdf);

    expect(texte.includes('Hello World!')).toBe(true);
  });

  it('déclenche une erreur si la syntaxe est mauvaise', async () => {
    await expect((async () => await generateurDocument({ contenuFichier: '##' }))()).rejects.toThrow(ErreurTypst);
  });

  it("sait générer un pdf à partir d'un chemin fichier", async () => {
    const document = await generateurDocument({ cheminFichier: typstFactice() });

    expect(estUnPdf(document!)).toBe(true);
  });

  describe('concernant une attestation PDF Cyberdépart', () => {
    it('génère un document identique au snapshot', async () => {
      const pdfAttendu = await readFile(new URL('../ressources/snapshot-attestation-cyberdepart.pdf', import.meta.url));
      const pdfGénéré = await generateurDocument({
        cheminFichier: fauxFournisseurDeChemin.back.attestationTypCyberdepart(),
        données: {
          organisation: "l'ANSSI",
        },
        polices: [
          {
            fontPaths: [
              fauxFournisseurDeChemin.front.police('Marianne-Regular.ttf'),
              fauxFournisseurDeChemin.front.police('Marianne-Bold.ttf'),
            ],
          },
        ],
      });

      const renduGénéré = await pixels(await rasterisePremierePage(pdfGénéré));
      const renduAttendu = await pixels(await rasterisePremierePage(pdfAttendu));

      expect(renduGénéré.info).toEqual(renduAttendu.info);
      expect(renduGénéré.data.equals(renduAttendu.data), 'Le rendu visuel du PDF diffère du snapshot').toBeTruthy();
    });
  });
});
