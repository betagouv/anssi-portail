import { createHash } from 'crypto';

export interface AdaptateurChiffrement {
  hacheSha256: (valeur: string) => string;
}

export const fabriqueAdaptateurChiffrement = (): AdaptateurChiffrement => {
  return {
    hacheSha256: (chaineEnClair: string) =>
      createHash('sha256')
        .update(chaineEnClair + process.env.CHIFFREMENT_SEL_DE_HASHAGE)
        .digest('hex'),
  };
};
