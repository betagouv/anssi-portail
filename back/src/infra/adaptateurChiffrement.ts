import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

export type ObjetChiffre = {
  iv: string;
  aad: string;
  donnees: string;
  tag: string;
};

const adaptateurChiffrement = (
  clefSecreteEnChaine: string
): AdaptateurChiffrement => {
  const clefSecrete = Buffer.from(clefSecreteEnChaine, 'hex');

  return {
    chiffre: (chaine) => {
      const iv = randomBytes(12);
      const aad = randomBytes(16);
      const donneesAChiffrer = JSON.stringify(chaine);

      const chiffreur = createCipheriv('chacha20-poly1305', clefSecrete, iv, {
        authTagLength: 16,
      });
      chiffreur.setAAD(aad, {
        plaintextLength: Buffer.byteLength(donneesAChiffrer),
      });

      const donneesChiffrees = Buffer.concat([
        chiffreur.update(donneesAChiffrer, 'utf-8'),
        chiffreur.final(),
      ]);
      const tag = chiffreur.getAuthTag();

      return {
        iv: iv.toString('hex'),
        aad: aad.toString('hex'),
        donnees: donneesChiffrees.toString('hex'),
        tag: tag.toString('hex'),
      };
    },
    dechiffre: (donneesChiffrees) => {
      const { iv, aad, donnees, tag } = donneesChiffrees;

      const dechiffreur = createDecipheriv(
        'chacha20-poly1305',
        clefSecrete,
        Buffer.from(iv, 'hex'),
        { authTagLength: 16 }
      );
      dechiffreur.setAAD(Buffer.from(aad, 'hex'), {
        plaintextLength: donnees.length,
      });
      dechiffreur.setAuthTag(Buffer.from(tag, 'hex'));

      const chaineDechiffree = Buffer.concat([
        dechiffreur.update(Buffer.from(donnees, 'hex')),
        dechiffreur.final(),
      ]);
      return JSON.parse(chaineDechiffree.toString());
    },
  };
};

export interface AdaptateurChiffrement {
  chiffre<T>(donnees: T): ObjetChiffre;
  dechiffre<T>(objetChiffre: ObjetChiffre): T;
}

type FabriqueAdaptateurChiffrement = {
  (adaptateurEnvironnement: AdaptateurEnvironnement): AdaptateurChiffrement;
  (cle: string): AdaptateurChiffrement;
};

export const fabriqueAdaptateurChiffrement: FabriqueAdaptateurChiffrement = (
  adaptateurEnvironnementOuCle: AdaptateurEnvironnement | string
) => {
  if (typeof adaptateurEnvironnementOuCle === 'string') {
    return adaptateurChiffrement(adaptateurEnvironnementOuCle);
  }
  return adaptateurChiffrement(
    adaptateurEnvironnementOuCle.chiffrement().cleChaCha20Hex()
  );
};
