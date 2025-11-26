import axios from 'axios';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export interface AdaptateurCellar {
  get(chemin: string): Promise<{ contenu: Buffer } | undefined>;
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
      return { contenu: Buffer.from(reponse.data) };
    } catch (erreur: Error | unknown) {
      if (axios.isAxiosError(erreur) && erreur.response?.status === 403) {
        return undefined;
      }
      throw erreur;
    }
  },
});
