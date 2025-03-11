import jwt from 'jsonwebtoken';

export interface AdaptateurJWT {
  genereToken(donnees: Record<string, any>): string;
}

export const adaptateurJWT: AdaptateurJWT = {
  genereToken: (donnees: Record<string, any>) =>
    jwt.sign(donnees, process.env.SECRET_JWT || '', { expiresIn: '1h' }),
};
