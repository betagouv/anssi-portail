import { Response, Router } from 'express';
import { encode } from 'html-entities';
import z from 'zod';
import { CompteCree } from '../bus/evenements/compteCree.js';
import { Utilisateur } from '../metier/utilisateur.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { schemaRessourceUtilisateurs } from './ressourceUtilisateurs.schema.js';
import { valideCorpsRequete } from './zod.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const ressourceUtilisateurs = ({
  busEvenements,
  entrepotUtilisateur,
  adaptateurRechercheEntreprise,
  adaptateurJWT,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceUtilisateurs),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceUtilisateurs>>, reponse: Response) => {
        const {
          telephone,
          domainesSpecialite,
          siretEntite,
          cguAcceptees,
          infolettreAcceptee,
          pixelDeSuiviAccepté,
          token,
        } = requete.body;

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
              pixelDeSuiviAccepté,
            },
            adaptateurRechercheEntreprise,
            adaptateurHachage
          );

          await entrepotUtilisateur.ajoute(utilisateur);

          // suite à la suppression de l'aseptisation, on force un encodage pour garder des données consistantes dans la base de données Journal
          const telephoneEncode = encode(telephone);
          await busEvenements.publie(
            new CompteCree({
              email,
              prenom,
              nom,
              infoLettre: infolettreAcceptee,
              telephone: telephoneEncode,
              pixelDeSuiviAccepté,
            })
          );

          reponse.sendStatus(201);
        } catch {
          reponse.status(400).send({ erreur: 'Le token est invalide' });
        }
      }
    )
  );
  return routeur;
};

export { ressourceUtilisateurs };
