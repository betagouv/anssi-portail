import { Request, Response, Router } from 'express';
import { EntrepotMesure } from '../../metier/entrepotMesure';
import { Mesure } from '../../metier/mesure';
import { Utilisateur } from '../../metier/utilisateur';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

const mesureDeModule = async (
  idMesure: string,
  entrepotMesure: EntrepotMesure
): Promise<[Mesure | undefined, number]> => {
  const mesure = await entrepotMesure.parId(idMesure);
  if (!mesure) {
    return [undefined, -1];
  }
  const mesuresDuModule = await entrepotMesure.duModule(mesure.module!);
  const rang = mesuresDuModule.sort((a, b) => a.ordre - b.ordre).findIndex((m) => m.id === idMesure);

  if (rang === -1) {
    return [undefined, rang];
  }

  if (mesure.module) {
    //TODO : supprimer cette condition et cette façon de faire
    mesure.module.mesures = mesuresDuModule;
  }
  return [mesure, rang];
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

      const [mesure, rang] = await mesureDeModule(idMesure, entrepotMesure);

      if (!mesure) {
        return reponse.sendStatus(404);
      }

      await utilisateur.prendEnCompte(mesure, rang, entrepotPriseEnCompte, busEvenements, mesure.module!);

      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
