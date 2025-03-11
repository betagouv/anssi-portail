import { Request, Response, Router } from 'express';

const ressourceProfil = () => {
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
