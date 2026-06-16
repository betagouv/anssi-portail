import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';
import { AxiosResponse, isAxiosError } from 'axios';
import axiosInstance from './axiosInstance';
import { Readable } from 'node:stream';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type DocumentCellar = {
  contenu: Buffer;
  typeDeContenu: string;
  nom: string;
};

export type FluxCellar = {
  flux: Readable;
  typeDeContenu: string;
  tailleDuContenu: number;
};

export type ConfigDeposeCellar = {
  url: string;
  nomDuBucket: string;
  region: string;
  credentials: ReturnType<typeof fromEnv>;
};

export type CleDuBucket = 'RESSOURCES_CYBER' | 'GUIDES' | 'VISAS' | 'GESTION_GUIDES';

export interface AdaptateurCellar {
  depose: (fichier: DocumentCellar, cleDuBucket: CleDuBucket) => Promise<void>;
  get(nomDuFichier: string, cleDuBucket: CleDuBucket): Promise<DocumentCellar | undefined>;
  getStream(nomDuFichier: string, cleDuBucket: CleDuBucket): Promise<FluxCellar | undefined>;
  existe(nomDuFichier: string, cleDuBucket: CleDuBucket): Promise<boolean>;
  supprime(nomDuFichier: string, cleDuBucket: CleDuBucket): Promise<void>;
}

export const adaptateurCellar = (adaptateurEnvironnement: AdaptateurEnvironnement): AdaptateurCellar => ({
  async get(nomDuFichier: string, cleDuBucket: CleDuBucket) {
    try {
      const reponse = await axiosInstance.get(
        `${selectionneURLCellarLecturePourUnBucket(adaptateurEnvironnement, cleDuBucket)}${nomDuFichier}`,
        { responseType: 'arraybuffer', timeout: 30_000 }
      );
      const typeDeContenu = (reponse.headers['content-type'] as string) ?? 'application/octet-stream';
      return {
        contenu: Buffer.from(reponse.data),
        typeDeContenu,
        nom: nomDuFichier,
      };
    } catch (erreur: Error | unknown) {
      if (isAxiosError(erreur) && erreur.response?.status === 403) {
        return undefined;
      }
      throw erreur;
    }
  },

  async getStream(nomDuFichier, cleDuBucket): Promise<FluxCellar | undefined> {
    try {
      const reponse: AxiosResponse<Readable> = await axiosInstance.get(
        `${selectionneURLCellarLecturePourUnBucket(adaptateurEnvironnement, cleDuBucket)}${nomDuFichier}`,
        { responseType: 'stream', timeout: 30_000 }
      );
      return {
        flux: reponse.data,
        typeDeContenu: (reponse.headers['content-type'] as string) ?? 'application/octet-stream',
        tailleDuContenu: Number(reponse.headers['content-length']),
      };
    } catch (erreur: Error | unknown) {
      if (isAxiosError(erreur)) {
        erreur.response?.data?.destroy?.();
        if (erreur.response?.status === 403) return undefined;
      }
      throw erreur;
    }
  },

  async existe(nomDuFichier, cleDuBucket): Promise<boolean> {
    try {
      await axiosInstance.head(
        `${selectionneURLCellarLecturePourUnBucket(adaptateurEnvironnement, cleDuBucket)}${nomDuFichier}`
      );
      return true;
    } catch {
      return false;
    }
  },

  async depose(document: DocumentCellar, cleDuBucket: CleDuBucket): Promise<void> {
    const config = selectionneConfigCellarDeposePourUnBucket(adaptateurEnvironnement, cleDuBucket);
    const s3Client = new S3Client({
      endpoint: config.url,
      region: config.region,
      credentials: config.credentials,
    });
    await s3Client.send(
      new PutObjectCommand({
        ACL: 'public-read',
        ContentType: document.typeDeContenu,
        Bucket: config.nomDuBucket,
        Body: document.contenu,
        Key: document.nom,
      })
    );
  },

  async supprime(nomDuFichier: string, cleDuBucket: CleDuBucket): Promise<void> {
    const config = selectionneConfigCellarDeposePourUnBucket(adaptateurEnvironnement, cleDuBucket);
    const s3Client = new S3Client({
      endpoint: config.url,
      region: config.region,
      credentials: config.credentials,
    });
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: config.nomDuBucket,
        Key: nomDuFichier,
      })
    );
  },
});

const selectionneURLCellarLecturePourUnBucket = (
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
    case 'GESTION_GUIDES':
      return '';
  }
};

export const selectionneConfigCellarDeposePourUnBucket = (
  adaptateurEnvironnement: AdaptateurEnvironnement,
  cleDeBucket: CleDuBucket
): ConfigDeposeCellar => {
  switch (cleDeBucket) {
    case 'GUIDES':
    case 'RESSOURCES_CYBER':
    case 'VISAS':
      throw new Error(`Interdit de déposer dans le bucket ${cleDeBucket}`);
    case 'GESTION_GUIDES':
      return {
        nomDuBucket: adaptateurEnvironnement.cellar().gestionGuides().nomDuBucket(),
        credentials: fromEnv(),
        region: adaptateurEnvironnement.cellar().region(),
        url: adaptateurEnvironnement.cellar().url(),
      };
  }
};
