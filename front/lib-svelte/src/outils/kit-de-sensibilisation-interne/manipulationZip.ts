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

  const ajouteLogoAuPdf = await prépareAjoutLogoAuPdf(logo);

  for (const [path] of Object.entries(files)) {
    if (path.normalize('NFC').toLowerCase().endsWith('.pdf')) {
      files[path] = await ajouteLogoAuPdf(files[path]);
    }
  }
  return zipSync(files, { level: 6 });
}

async function prépareAjoutLogoAuPdf(
  logo: File
): Promise<(fichierPDF: Uint8Array<ArrayBuffer>) => Promise<Uint8Array<ArrayBuffer>>> {
  const typesMIMESupportés = ['image/jpeg', 'image/png'] as const;
  type TypesMIMESupportés = (typeof typesMIMESupportés)[number];

  if (!(typesMIMESupportés as readonly string[]).includes(logo.type)) {
    throw new Error(`Type d'image non supporté : ${logo.type}`);
  }
  const typeLogo: TypesMIMESupportés = logo.type as TypesMIMESupportés;

  const donnéesLogo = await logo.arrayBuffer();
  const ZONE_LOGO = {
    x: 39,
    y: 22.5,
    width: 129,
    height: 74,
  } as const;

  return async (fichierPDF) => {
    const pdfDoc = await PDFDocument.load(fichierPDF);
    const image: PDFImage = await {
      'image/jpeg': pdfDoc.embedJpg(donnéesLogo),
      'image/png': pdfDoc.embedPng(donnéesLogo),
    }[typeLogo];

    const page = pdfDoc.getPage(0);
    const dimensionsLogo = image.scaleToFit(ZONE_LOGO.width, ZONE_LOGO.height);

    page.drawImage(image, {
      x: ZONE_LOGO.x + (ZONE_LOGO.width - dimensionsLogo.width) / 2,
      y: ZONE_LOGO.y + (ZONE_LOGO.height - dimensionsLogo.height) / 2,
      width: dimensionsLogo.width,
      height: dimensionsLogo.height,
    });

    return await pdfDoc.save();
  };
}

export function téléchargeFichierDansNavigateur(data: Uint8Array<ArrayBuffer>, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type: 'application/zip' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
