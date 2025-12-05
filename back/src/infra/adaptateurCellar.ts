import axios from 'axios';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type DocumentCellar = {
  contenu: Buffer;
  typeDeContenu: string;
};

export type CleDuBucket = 'RESSOURCES_CYBER' | 'GUIDES' | 'VISAS';

export interface AdaptateurCellar {
  get(
    nomDuFichier: string,
    cleDuBucket: CleDuBucket
  ): Promise<DocumentCellar | undefined>;
}

export const adaptateurCellar = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurCellar => ({
  async get(nomDuFichier: string, cleDuBucket: CleDuBucket) {
    try {
      const reponse = await axios.get(
        `${selectionneURLCellarPourUnBucket(adaptateurEnvironnement, cleDuBucket)}${nomDuFichier}`,
        { responseType: 'arraybuffer' }
      );
      const typeDeContenu =
        reponse.headers['content-type'] ?? 'application/octet-stream';
      return {
        contenu: Buffer.from(reponse.data),
        typeDeContenu,
      };
    } catch (erreur: Error | unknown) {
      if (axios.isAxiosError(erreur) && erreur.response?.status === 403) {
        return undefined;
      }
      throw erreur;
    }
  },
});

const selectionneURLCellarPourUnBucket = (
  adaptateurEnvironnement: AdaptateurEnvironnement,
  cleDeBucket: CleDuBucket
): string => {
  switch (cleDeBucket) {
    case 'GUIDES':
      return adaptateurEnvironnement.urlCellar().guides();
    case 'RESSOURCES_CYBER':
      return adaptateurEnvironnement.urlCellar().ressourcesCyber();
    case 'VISAS':
      return adaptateurEnvironnement.urlCellar().visas();
  }
};
