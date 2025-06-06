import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceProfil = ({
  adaptateurJWT,
  entrepotUtilisateur,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (requete: Request, reponse: Response) => {
    try {
      adaptateurJWT.decode(requete.session?.token);
    } catch {
      reponse.clearCookie('session');
    } finally {
      const email = requete.session?.email;
      const utilisateurConnecte = email
        ? await entrepotUtilisateur.parEmail(email)
        : undefined;
      reponse.send({
        email,
        nom: utilisateurConnecte?.nom,
        prenom: utilisateurConnecte?.prenom,
        siret: (await utilisateurConnecte?.organisation())?.siret,
        estAgentAnssi: (await utilisateurConnecte?.estAgentAnssi()),
        idListeFavoris: utilisateurConnecte?.idListeFavoris,
      });
    }
  });
  return routeur;
};

export { ressourceProfil };
