import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';

const ressourceProfil = ({adaptateurJWT}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (requete: Request, reponse: Response) => {
    reponse.send({
      nom: requete.session!.nom,
      prenom: requete.session!.prenom,
      email: requete.session!.email,
      siret: requete.session!.siret,
    });
  });

  routeur.get('/verification-token-creation-compte', (requete: Request, reponse: Response) => {
    const { token } = requete.query;
    try {
      if(!token) throw new Error('Token manquant');
      const informationsUtilisateur = adaptateurJWT.decode(token as string);
      reponse.send(informationsUtilisateur);
    } catch(e) {
      reponse.sendStatus(401);
    }
  });
  return routeur;
};

export { ressourceProfil };
