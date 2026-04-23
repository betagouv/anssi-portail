import { Router } from 'express';
import { decode } from 'html-entities';
import { MiseAJourFavorisUtilisateur } from '../../bus/miseAJourFavorisUtilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';

const ressourceFavori = ({
  middleware,
  entrepotFavori,
  busEvenements,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.delete(
    '/:id',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    middleware.aseptise('id'),
    filetRouteAsynchrone(async (requete, reponse) => {
      const id = decode(requete.params.id as string);
      const utilisateur = requete.utilisateur;
      await entrepotFavori.retire({ idItemCyber: id, utilisateur });

      await busEvenements.publie(new MiseAJourFavorisUtilisateur({ utilisateur }));
      reponse.sendStatus(200);
    })
  );

  return routeur;
};

export { ressourceFavori };
