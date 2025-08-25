import { Request, Response, Router } from 'express';
import { Organisation } from '../metier/utilisateur';
import { ConfigurationServeur } from './configurationServeur';
import {
  estCodeDepartement,
  regionDuDepartement,
} from '../metier/referentielDepartements';

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

        const codeDepartement = estCodeDepartement(organisation?.departement)
          ? organisation.departement
          : undefined;

        const codeRegion =
          organisation?.region ?? regionDuDepartement(codeDepartement);

        reponse.send({
          email: utilisateurConnecte?.email,
          nom: utilisateurConnecte?.nom,
          prenom: utilisateurConnecte?.prenom,
          siret: organisation?.siret,
          estAgentAnssi: await utilisateurConnecte?.estAgentAnssi(),
          idListeFavoris: utilisateurConnecte?.idListeFavoris,
          codeDepartement,
          codeRegion,
        });
      }
    }
  );
  return routeur;
};

export { ressourceProfil };
