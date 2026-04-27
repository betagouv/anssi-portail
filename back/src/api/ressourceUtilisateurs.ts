import { Request, Response, Router } from 'express';
import { encode } from 'html-entities';
import { CompteCree } from '../bus/evenements/compteCree';
import { Utilisateur } from '../metier/utilisateur';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaRessourceUtilisateurs } from './ressourceUtilisateurs.schema';
import { valideCorpsRequete } from './zod';

const ressourceUtilisateurs = ({
  busEvenements,
  entrepotUtilisateur,
  adaptateurRechercheEntreprise,
  adaptateurJWT,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceUtilisateurs),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const { telephone, domainesSpecialite, siretEntite, cguAcceptees, infolettreAcceptee, token } = requete.body;

      try {
        const { email, nom, prenom, siret } = adaptateurJWT.decode(token);

        const utilisateur = new Utilisateur(
          {
            email,
            prenom,
            nom,
            telephone,
            domainesSpecialite,
            siretEntite: siret ?? siretEntite,
            cguAcceptees,
            infolettreAcceptee,
          },
          adaptateurRechercheEntreprise
        );

        await entrepotUtilisateur.ajoute(utilisateur);

        // suite à la suppression de l'aseptisation, on force un encodage pour garder des données consistantes dans la base de données Journal
        const telephoneEncode = encode(telephone);
        await busEvenements.publie(
          new CompteCree({ email, prenom, nom, infoLettre: infolettreAcceptee, telephone: telephoneEncode })
        );

        reponse.sendStatus(201);
      } catch {
        reponse.status(400).send({ erreur: 'Le token est invalide' });
      }
    })
  );
  return routeur;
};

export { ressourceUtilisateurs };
