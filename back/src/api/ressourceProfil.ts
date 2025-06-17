import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceProfil = ({
  adaptateurJWT,
  entrepotUtilisateur,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur),
    async (requete: Request, reponse: Response) => {
      try {
        adaptateurJWT.decode(requete.session?.token);
      } catch {
        reponse.clearCookie('session');
      } finally {
        const utilisateurConnecte = requete.utilisateur;
        reponse.send({
          email: requete.utilisateur?.email,
          nom: utilisateurConnecte?.nom,
          prenom: utilisateurConnecte?.prenom,
          siret: (await utilisateurConnecte?.organisation())?.siret,
          estAgentAnssi: await utilisateurConnecte?.estAgentAnssi(),
          idListeFavoris: utilisateurConnecte?.idListeFavoris,
        });
      }
    }
  );
  return routeur;
};

export { ressourceProfil };
