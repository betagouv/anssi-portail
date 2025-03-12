import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceUtilisateurs = ({
  entrepotUtilisateur,
  middleware
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post('/', middleware.aseptise('email'), async (requete: Request, reponse: Response) => {
    const { email } = requete.body;
    await entrepotUtilisateur.ajoute({ email });
    reponse.sendStatus(201);
  });
  return routeur;
};

export { ressourceUtilisateurs };
