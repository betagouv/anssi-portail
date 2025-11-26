import axios from 'axios';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type DocumentCellar = {
  contenu: Buffer;
  typeDeContenu: string;
};

export interface AdaptateurCellar {
  get(chemin: string): Promise<DocumentCellar | undefined>;
}

export const adaptateurCellar = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurCellar => ({
  async get(chemin: string) {
    try {
      const reponse = await axios.get(
        `${adaptateurEnvironnement.urlCellar()}${chemin}`,
        { responseType: 'arraybuffer' }
      );
      return {
        contenu: Buffer.from(reponse.data),
        typeDeContenu: `${reponse.headers['Content-Type'] ?? 'application/octet-stream'}`,
      };
    } catch (erreur: Error | unknown) {
      if (axios.isAxiosError(erreur) && erreur.response?.status === 403) {
        return undefined;
      }
      throw erreur;
    }
  },
});
