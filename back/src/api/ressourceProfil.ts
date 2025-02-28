import { ConfigurationServeur } from './configurationServeur';
import { Response, Request, Router } from 'express';

const ressourceProfil = (configurationServeur: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', (requete: Request, reponse: Response) => {
    reponse.send({
      nom: requete.session!.nom,
      prenom: requete.session!.prenom,
      email: requete.session!.email,
      siret: requete.session!.siret,
    });
  });
  return routeur;
};

export { ressourceProfil };
