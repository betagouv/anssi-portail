import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceProfil = ({ adaptateurJWT }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (requete: Request, reponse: Response) => {
    try {
      adaptateurJWT.decode(requete.session?.token);
    } catch (e) {
      reponse.clearCookie('session')
    } finally {
      reponse.send({
        nom: requete.session?.nom,
        prenom: requete.session?.prenom,
        email: requete.session?.email,
        siret: requete.session?.siret,
      });
    }
  });
  return routeur;
};

export { ressourceProfil };
