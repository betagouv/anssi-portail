import { Response, Router } from 'express';
import { encode } from 'html-entities';
import z from 'zod';
import { CompteCree, payloadDeCréationDeCompte } from '../bus/evenements/compteCree.js';
import { Utilisateur } from '../metier/utilisateur.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { schemaRessourceUtilisateurs } from './ressourceUtilisateurs.schema.js';
import { valideCorpsRequete } from './zod.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const construitLeSuiviDepuisLaRequête = (
  requête: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceUtilisateurs>>
): CompteCree['suivi'] => {
  const { campagne, redirectUrl, pageSource } = requête.query;

  const parcoursDestination = ((redirectUrl) => {
    try {
      const chemin = new URL(redirectUrl as string).pathname;
      if (chemin === '/parcours-complet') return 'complet';
      if (chemin === '/modules/1') return 'allégé';
    } catch {
      return undefined;
    }
  })(redirectUrl);

  const cheminSource = ((source: string | undefined) => {
    try {
      return source ? new URL(source).pathname : undefined;
    } catch {
      return undefined;
    }
  })(pageSource as string | undefined);

  if (!campagne && !parcoursDestination && !cheminSource) return undefined;

  const suivi: CompteCree['suivi'] = {
    ...(campagne && { campagne: campagne as string }),
    ...(parcoursDestination && { parcoursDestination }),
    ...(cheminSource && { source: cheminSource }),
  };

  return suivi;
};

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

          const payloadDeCréationdeCompte: payloadDeCréationDeCompte = {
            email,
            prenom,
            nom,
            infoLettre: infolettreAcceptee,
            // suite à la suppression de l'aseptisation, on force un encodage pour garder des données consistantes dans la base de données Journal
            telephone: encode(telephone),
            pixelDeSuiviAccepté,
            suivi: construitLeSuiviDepuisLaRequête(requete),
          };

          await busEvenements.publie(new CompteCree(payloadDeCréationdeCompte));

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
