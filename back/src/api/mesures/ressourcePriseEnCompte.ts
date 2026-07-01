import { Request, Response, Router } from 'express';
import { EntrepotMesure } from '../../metier/entrepotMesure.js';
import { Mesure } from '../../metier/mesure.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { Module } from '../../metier/module.js';
import { EntrepôtModule } from '../../metier/EntrepotModule.js';

const mesureDeModule = async (
  idMesure: string,
  entrepotMesure: EntrepotMesure,
  entrepôtModule: EntrepôtModule
): Promise<{ mesure: Mesure; module: Module } | undefined> => {
  const mesure = await entrepotMesure.parId(idMesure);
  if (!mesure) {
    return undefined;
  }

  const module = await entrepôtModule.pourLaMesure(mesure);

  return { mesure, module };
};

export const ressourcePriseEnCompte = ({
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  entrepotMesure,
  entrepôtModule,
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

      const mesureEtModule = await mesureDeModule(idMesure, entrepotMesure, entrepôtModule);

      if (!mesureEtModule) {
        return reponse.sendStatus(404);
      }

      const { mesure, module } = mesureEtModule;
      const nouvelÉtatDuModule = await utilisateur.prendEnCompte(mesure, entrepotPriseEnCompte, busEvenements, module);

      return reponse.status(201).send(nouvelÉtatDuModule);
    })
  );

  return routeur;
};
