import { Request, Response, Router } from 'express';
import { EntrepotMesure } from '../../metier/entrepotMesure';
import { Mesure } from '../../metier/mesure';
import { Utilisateur } from '../../metier/utilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

const mesureDeModule = async (idMesure: string, entrepotMesure: EntrepotMesure): Promise<Mesure | undefined> => {
  const mesure = await entrepotMesure.parId(idMesure);
  if (!mesure) {
    return undefined;
  }
  //TODO : supprimer cette façon de faire
  mesure.module.mesures = await entrepotMesure.duModule(mesure.module);
  const rang = mesure.module.rangDeLaMesure(mesure);

  if (rang === -1) {
    return undefined;
  }

  return mesure;
};

export const ressourcePriseEnCompte = ({
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  entrepotMesure,
  entrepotPriseEnCompte,
  busEvenements,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.put(
    '/:idMesure/prise-en-compte',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur as Utilisateur;
      const idMesure = requete.params.idMesure as string;

      const mesure = await mesureDeModule(idMesure, entrepotMesure);

      if (!mesure) {
        return reponse.sendStatus(404);
      }

      await utilisateur.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, mesure.module);

      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
