import { unzipSync, zipSync } from 'fflate';

function filtreContenuZipParSuffix(buffer: ArrayBuffer, fichiersÀSupprimer: RegExp[]): Uint8Array<ArrayBuffer> {
  const files = unzipSync(new Uint8Array(buffer), {
    filter: ({ name }) => {
      return !fichiersÀSupprimer.some((regExp) => name.match(regExp));
    },
  });

  return zipSync(files, { level: 6 }) as Uint8Array<ArrayBuffer>;
}

export function retireTemplatesAvecLogo(buffer: ArrayBuffer): Uint8Array<ArrayBuffer> {
  return filtreContenuZipParSuffix(buffer, [/(?<!sans)_logo\.pdf$/]);
}

export function retireAffichesSansLogo(buffer: ArrayBuffer): Uint8Array<ArrayBuffer> {
  return filtreContenuZipParSuffix(buffer, [/_sans_logo.pdf$/]);
}

export function téléchargeFichierDansNavigateur(data: Uint8Array<ArrayBuffer>, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type: 'application/zip' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
