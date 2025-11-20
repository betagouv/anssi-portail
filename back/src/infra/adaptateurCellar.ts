import axios from 'axios';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export interface AdaptateurCellar {
  get(chemin: string): Promise<Buffer>;
}

export const adaptateurCellar = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurCellar => ({
  async get(chemin: string): Promise<Buffer> {
    const reponse = await axios.get(
      `${adaptateurEnvironnement.urlCellar()}${chemin}`,
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(reponse.data);
  },
});
