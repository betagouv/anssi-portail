import { unzipSync, zipSync } from 'fflate';

function filtreContenuZipParSuffix(buffer: ArrayBuffer, suffixesÀSupprimer: string[]): Uint8Array<ArrayBuffer> {
  const files = unzipSync(new Uint8Array(buffer), {
    filter: ({ name }) => {
      return !suffixesÀSupprimer.some((suffix) => name.endsWith(suffix));
    },
  });

  return zipSync(files, { level: 6 }) as Uint8Array<ArrayBuffer>;
}

export function retireTemplatesSansLogo(buffer: ArrayBuffer): Uint8Array<ArrayBuffer> {
  return filtreContenuZipParSuffix(buffer, ['_sans_logo.pdf']);
}

export function téléchargeFichierDansNavigateur(data: Uint8Array<ArrayBuffer>, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type: 'application/zip' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
