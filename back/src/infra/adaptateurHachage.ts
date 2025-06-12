import { AdaptateurEnvironnement } from './adaptateurEnvironnement';
import { createHmac } from 'node:crypto';

const hacheAvecUnSeulSecret = (valeur: string, secret: string) =>
  createHmac('sha256', secret).update(valeur).digest('hex');

export type AdaptateurHachage = {
  hache: (valeur: string) => string;
};

export const adaptateurHachage = ({
  adaptateurEnvironnement,
}: {
  adaptateurEnvironnement: AdaptateurEnvironnement;
}): AdaptateurHachage => ({
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
