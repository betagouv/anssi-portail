import JSZip from 'jszip';

export type Fichier = { nom: string; buffer: Buffer };

type Archive = string | ArrayBuffer | Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike> | number[] | Blob;

export interface AdaptateurCompression {
  génèreArchive: (tableauDeFichiers: Fichier[]) => Promise<Archive>;
}

export const adaptateurCompression: AdaptateurCompression = {
  génèreArchive: async (tableauDeFichiers: Fichier[]): Promise<Archive> => {
    const archive = new JSZip();

    tableauDeFichiers.forEach(({ nom, buffer }) => {
      archive.file(nom, buffer, { binary: true });
    });

    return await archive.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });
  },
};
