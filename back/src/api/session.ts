import { Request, Response } from 'express';

export const detruisSession = (requete: Request, reponse: Response) => {
  reponse.clearCookie('session');
  requete.session = null;
};
