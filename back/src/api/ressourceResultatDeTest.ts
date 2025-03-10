import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { TestRealise } from '../bus/testRealise';
import { regions } from '../metier/referentielRegions';
import { check, validationResult } from 'express-validator';
import { codesSecteur } from '../metier/referentielSecteurs';

const ressourceResultatDeTest = ({
  busEvenement,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.aseptise('region', 'secteur', 'tailleOrganisation', "reponses.*"),
    [
      check('region').isString().isIn(regions).withMessage('Région invalide'),
      check('secteur').isString().isIn(codesSecteur).withMessage('Secteur invalide'),
    ],
    async (requete: Request, reponse: Response) => {
      const { tailleOrganisation, region, secteur, reponses } = requete.body;

      const erreurs = validationResult(requete);
      if(!erreurs.isEmpty()) {
        reponse.status(400).json({ erreur: erreurs.array()[0].msg });
        return;
      }

      await busEvenement.publie(
        new TestRealise({
          region: region,
          secteur: secteur,
          tailleOrganisation: tailleOrganisation,
          reponses: reponses,
        })
      );
      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceResultatDeTest };
