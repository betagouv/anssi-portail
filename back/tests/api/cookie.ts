import { Response } from 'supertest';
interface Session {
  email?: string;
  token?: string;
  AgentConnectIdToken?: string;
}

export type AgentConnectInfo = {
  state: string;
  nonce: string;
};

const enObjet = (cookie: string) =>
  cookie.split('; ').reduce((acc: Record<string, unknown>, v) => {
    const [cle, valeur] = v.split('=');
    try {
      acc[cle] = JSON.parse(decodeURIComponent(valeur).slice(2));
    } catch {
      acc[cle] = valeur;
    }
    return acc;
  }, {});

const decodeSessionDuCookie = (reponse: Response, indiceHeader: number) => {
  try {
    const headerCookie = reponse.headers['set-cookie'];
    const cookieSession = enObjet(headerCookie[indiceHeader]);
    return JSON.parse(
      Buffer.from(cookieSession.session as string, 'base64').toString()
    );
  } catch {
    return undefined;
  }
};

const encodeSession = (contenuSession: Session) => {
  const sessionEnBase64 = Buffer.from(
    JSON.stringify(contenuSession),
    'utf-8'
  ).toString('base64');
  return `session=${sessionEnBase64}`;
};

export { enObjet, decodeSessionDuCookie, encodeSession };
