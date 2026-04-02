import { Canvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import sharp from 'sharp';

export type ConfigurationImage = {
  largeur: number;
};

export interface GenerateurImage {
  depuisPdf(pdfOriginal: Buffer, configuration?: ConfigurationImage): Promise<Buffer>;
}

export class GenerateurImageAvif implements GenerateurImage {
  async depuisPdf(pdfOriginal: Buffer, configuration?: ConfigurationImage) {
    const pdf = await getDocument({ data: new Uint8Array(pdfOriginal) }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 });

    const canvas = new Canvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx as unknown as CanvasRenderingContext2D,
      canvas: canvas as unknown as HTMLCanvasElement,
      viewport,
    }).promise;

    const pngBuffer = await canvas.toBuffer('image/png');
    const avifBuffer = await sharp(pngBuffer)
      .resize({ width: configuration?.largeur })
      .avif({ quality: 80, effort: 2 })
      .toBuffer();
    return avifBuffer;
  }
}
