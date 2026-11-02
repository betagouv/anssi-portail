import { PDFDocument, PDFImage } from '@pdfme/pdf-lib';
import { unzipSync, zipSync, type Unzipped } from 'fflate';

function filtreContenuZipParSuffix(buffer: ArrayBuffer, fichiersÀSupprimer: RegExp[]): Uint8Array<ArrayBuffer> {
  const files = unzipSync(new Uint8Array(buffer), {
    filter: ({ name }) => {
      return !fichiersÀSupprimer.some((regExp) => name.match(regExp));
    },
  });

  return zipSync(files, { level: 6 });
}

export function retireAffichesAvecEmplacementLogo(buffer: ArrayBuffer): Uint8Array<ArrayBuffer> {
  return filtreContenuZipParSuffix(buffer, [/(?<!sans)_logo\.pdf$/]);
}

export async function retireAffichesSansEmplacementLogo(
  buffer: ArrayBuffer,
  logo: File
): Promise<Uint8Array<ArrayBuffer>> {
  const files: Unzipped = unzipSync(new Uint8Array(buffer), {
    filter: ({ name }) => {
      return !name.match(/_sans_logo.pdf$/);
    },
  });
  for (const [path] of Object.entries(files)) {
    if (path.normalize('NFC').toLowerCase().endsWith('.pdf')) {
      files[path] = await ajouteLogoAuPdf(files[path], logo);
    }
  }
  return zipSync(files, { level: 6 });
}

async function ajouteLogoAuPdf(fichierPDF: Uint8Array<ArrayBuffer>, logo: File): Promise<Uint8Array<ArrayBuffer>> {
  const pdfDoc = await PDFDocument.load(fichierPDF);
  // const image = logo.type === 'image/png' ? await pdfDoc.embedPng(logo) : await pdfDoc.embedJpg(logo);
  let image: PDFImage;
  if (logo.type === 'image/png') {
    image = await pdfDoc.embedPng(await logo.arrayBuffer());
  } else if (logo.type === 'image/jpeg') {
    image = await pdfDoc.embedJpg(await logo.arrayBuffer());
  } else {
    throw new Error("Type d'image non supporté : " + logo.type);
  }

  const page = pdfDoc.getPage(0);

  page.drawImage(image, {
    x: 50,
    y: 50,
    width: 150,
    height: 50,
  });

  return await pdfDoc.save();
}

export function téléchargeFichierDansNavigateur(data: Uint8Array<ArrayBuffer>, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type: 'application/zip' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
