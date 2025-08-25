import { Request, Response, Router } from 'express';
import { Organisation } from '../metier/utilisateur';
import { ConfigurationServeur } from './configurationServeur';

const ressourceProfil = ({
  adaptateurJWT,
  entrepotUtilisateur,
  middleware,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    async (requete: Request, reponse: Response) => {
      try {
        adaptateurJWT.decode(requete.session?.token);
      } catch {
        reponse.clearCookie('session');
      } finally {
        const utilisateurConnecte = requete.utilisateur;
        const organisation: Organisation =
          await utilisateurConnecte?.organisation();
        reponse.send({
          email: utilisateurConnecte?.email,
          nom: utilisateurConnecte?.nom,
          prenom: utilisateurConnecte?.prenom,
          siret: organisation?.siret,
          estAgentAnssi: await utilisateurConnecte?.estAgentAnssi(),
          idListeFavoris: utilisateurConnecte?.idListeFavoris,
          codeDepartement: organisation?.departement,
          codeRegion: organisation?.region,
        });
      }
    }
  );
  return routeur;
};

export { ressourceProfil };
