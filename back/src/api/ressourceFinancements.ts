import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceFinancements = ({
  entrepotFinancement,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    try {
      const financements = await entrepotFinancement.tous();
      reponse.send(
        financements.map((financement) => ({
          id: financement.id,
          nom: financement.nom,
          financeur: financement.financeur,
          typesDeFinancement: financement.typesDeFinancement,
          entitesElligibles: financement.entitesElligibles,
          perimetresGeographiques: financement.perimetresGeographiques,
          regions: financement.regions,
        }))
      );
    } catch {
      reponse.sendStatus(500);
    }
  });
  return routeur;
};
