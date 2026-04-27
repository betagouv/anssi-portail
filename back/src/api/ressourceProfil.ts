import { Request, Response, Router } from 'express';
import { decode } from 'html-entities';
import { estCodeDepartement, regionDuDepartement } from '../metier/referentielDepartements';
import { Organisation } from '../metier/utilisateur';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourceProfil = ({
  adaptateurJWT,
  entrepotUtilisateur,
  middleware,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      try {
        adaptateurJWT.decode(requete.session?.token);
      } catch {
        reponse.clearCookie('session');
      } finally {
        const utilisateurConnecte = requete.utilisateur;
        const organisation: Organisation = await utilisateurConnecte?.organisation();

        const codeDepartement = estCodeDepartement(organisation?.departement) ? organisation.departement : undefined;

        const codeRegion = organisation?.region ?? regionDuDepartement(codeDepartement);

        reponse.send({
          email: utilisateurConnecte?.email,
          nom: utilisateurConnecte?.nom,
          prenom: utilisateurConnecte?.prenom,
          siret: decode(organisation?.siret),
          estAgentAnssi: await utilisateurConnecte?.estAgentAnssi(),
          idListeFavoris: utilisateurConnecte?.idListeFavoris,
          codeDepartement,
          codeRegion,
          codeActivite: organisation?.codeActivite,
        });
      }
    })
  );
  return routeur;
};

export { ressourceProfil };
