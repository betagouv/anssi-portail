import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AdaptateurJWT {
  genereToken(donnees: Record<string, unknown>): string;
  decode(token: string): JwtPayload;
}

export const adaptateurJWT: AdaptateurJWT = {
  genereToken: (donnees: Record<string, unknown>) =>
    jwt.sign(donnees, process.env.SECRET_JWT || '', { expiresIn: '1h' }),
  decode: (token: string) =>
    jwt.verify(token, process.env.SECRET_JWT || '') as JwtPayload,
};
