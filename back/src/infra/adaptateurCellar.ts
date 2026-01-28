import axios, { AxiosResponse } from 'axios';
import { Readable } from 'node:stream';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type DocumentCellar = {
  contenu: Buffer;
  typeDeContenu: string;
};

export type FluxCellar = {
  flux: Readable;
  typeDeContenu: string;
  tailleDuContenu: number;
};

export type CleDuBucket = 'RESSOURCES_CYBER' | 'GUIDES' | 'VISAS';

export interface AdaptateurCellar {
  get(
    nomDuFichier: string,
    cleDuBucket: CleDuBucket
  ): Promise<DocumentCellar | undefined>;
  getStream(
    nomDuFichier: string,
    cleDuBucket: CleDuBucket
  ): Promise<FluxCellar | undefined>;
}

const NOMBRE_TENTATIVES_MAXIMUM = 2;

export const adaptateurCellar = (
  adaptateurEnvironnement: AdaptateurEnvironnement
): AdaptateurCellar => ({
  async get(nomDuFichier: string, cleDuBucket: CleDuBucket) {
    let nombreTentatives = 0;
    while (nombreTentatives <= NOMBRE_TENTATIVES_MAXIMUM) {
      try {
        nombreTentatives++;
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
        if (nombreTentatives >= NOMBRE_TENTATIVES_MAXIMUM) {
          throw erreur;
        }
      }
    }
  },

  async getStream(nomDuFichier, cleDuBucket): Promise<FluxCellar | undefined> {
    try {
      const reponse: AxiosResponse<Readable> = await axios.get(
        `${selectionneURLCellarPourUnBucket(adaptateurEnvironnement, cleDuBucket)}${nomDuFichier}`,
        { responseType: 'stream' }
      );
      return {
        flux: reponse.data,
        typeDeContenu:
          reponse.headers['content-type'] ?? 'application/octet-stream',
        tailleDuContenu: Number(reponse.headers['content-length']),
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
