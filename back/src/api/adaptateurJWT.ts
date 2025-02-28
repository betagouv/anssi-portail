import jwt from 'jsonwebtoken';

export interface AdaptateurJWT {
  genereToken(email: string): string;
}

export const adaptateurJWT: AdaptateurJWT = {
  genereToken: (email: string) =>
    jwt.sign({ email }, process.env.SECRET_JWT || '', { expiresIn: '1h' }),
};
