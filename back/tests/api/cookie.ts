import { Response } from 'supertest';

const enObjet = (cookie: string) =>
  cookie.split('; ').reduce((acc: Record<string, any>, v) => {
    const [cle, valeur] = v.split('=');
    try {
      acc[cle] = JSON.parse(decodeURIComponent(valeur).slice(2));
    } catch (error) {
      acc[cle] = valeur;
    }
    return acc;
  }, {});

const decodeSessionDuCookie = (reponse: Response, indiceHeader: number) => {
  try {
    const headerCookie = reponse.headers['set-cookie'];
    const cookieSession = enObjet(headerCookie[indiceHeader]);
    return JSON.parse(Buffer.from(cookieSession.session, 'base64').toString());
  } catch (e) {
    return undefined;
  }
};

export { enObjet, decodeSessionDuCookie };
