import jwt, { JwtPayload } from 'jsonwebtoken';
import { AdaptateurEnvironnement } from '../infra/adaptateurEnvironnement.js';

const UNE_HEURE = Temporal.Duration.from({ hours: 1 });

export interface AdaptateurJWT {
  genereToken(donnees: Record<string, unknown>): string;
  decode(token: string): JwtPayload;
}

export const adaptateurJWT = (adaptateurEnvironnement: AdaptateurEnvironnement): AdaptateurJWT => ({
  genereToken: (donnees: Record<string, unknown>) =>
    jwt.sign(donnees, adaptateurEnvironnement.secrets().jwt(), { expiresIn: UNE_HEURE.total('seconds') }),
  decode: (token: string) => jwt.verify(token, adaptateurEnvironnement.secrets().jwt()) as JwtPayload,
});
