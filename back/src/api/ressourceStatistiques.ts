import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const SERVICES_ET_RESSOURCES_CONSULTES = 1787;

export const ressourceStatistiques = ({
  entrepotUtilisateur,
  entrepotResultatTest,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    reponse.send({
      utilisateursInscrits: await entrepotUtilisateur.taille(),
      servicesEtRessourcesConsultes: SERVICES_ET_RESSOURCES_CONSULTES,
      testsMaturite: {
        total: await entrepotResultatTest.taille(),
      },
    });
  });
  return routeur;
};
