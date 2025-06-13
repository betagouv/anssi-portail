import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { createHmac } from 'node:crypto';
import { hash as hashBCrypt, compare as compareBCrypt } from 'bcrypt';

const NOMBRE_DE_PASSES = 10;

const hacheAvecUnSeulSecret = (valeur: string, secret: string) =>
  createHmac('sha256', secret).update(valeur).digest('hex');

export type AdaptateurHachage = {
  hacheBCrypt: (valeur: string) => Promise<string>;
  compareBCrypt: (valeurEnClair: string, empreinte: string) => Promise<boolean>;
  hache: (valeur: string) => string;
};

export const fabriqueAdaptateurHachage = ({
  adaptateurEnvironnement,
}: {
  adaptateurEnvironnement: AdaptateurEnvironnement;
}): AdaptateurHachage => ({
  hacheBCrypt: async (chaineEnClair: string): Promise<string> =>
    hashBCrypt(chaineEnClair, NOMBRE_DE_PASSES),

  compareBCrypt: (valeurEnClair, empreinte) =>
    compareBCrypt(valeurEnClair, empreinte),

  hache: (valeur: string): string => {
    const secrets = adaptateurEnvironnement.hachage().tousLesSecretsDeHachage();

    const hashFinal = secrets.reduce(
      (acc, { secret }) => hacheAvecUnSeulSecret(acc, secret),
      valeur
    );

    const version = secrets
      .map(({ version: numVersion }) => `v${numVersion}`)
      .join('-');

    return `${version}:${hashFinal}`;
  },
});
