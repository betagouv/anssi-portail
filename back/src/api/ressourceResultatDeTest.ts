import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { TestRealise } from '../bus/testRealise';
import {codesRegion, regions} from '../metier/referentielRegions';
import { body, check } from 'express-validator';
import { codesSecteur } from '../metier/referentielSecteurs';
import { codesTranchesEffectif } from '../metier/referentielTranchesEffectifEtablissement';

const clesReponsesValides = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
];

const ressourceResultatDeTest = ({
  busEvenements,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    [
      check('region').isString().optional({values: "null"}).isIn(codesRegion).withMessage('Région invalide'),
      check('secteur')
        .isString()
        .optional({values: "null"})
        .isIn(codesSecteur)
        .withMessage('Secteur invalide'),
      check('tailleOrganisation')
        .isString()
        .optional({values: "null"})
        .isIn(codesTranchesEffectif)
        .withMessage("Taille d'organisation invalide"),
      body('reponses')
        .custom(
          (reponses) => typeof reponses === 'object' && !Array.isArray(reponses)
        )
        .withMessage('Les réponses doivent être dans un objet'),
      body('reponses')
        .custom((reponses) =>
          Object.keys(reponses).every((cle) =>
            clesReponsesValides.includes(cle)
          )
        )
        .withMessage('Les clés de réponse sont invalides'),
      body('reponses')
        .custom((reponses) =>
          Object.keys(reponses).every((cle) => {
            const valeur = parseInt(reponses[cle]);
            return Number.isInteger(valeur) && valeur >= 1 && valeur <= 5;
          })
        )
        .withMessage(
          'Les valeurs de réponses doivent être comprises entre 1 et 5'
        ),
    ],
    middleware.valide(),
    async (requete: Request, reponse: Response) => {
      const { tailleOrganisation, region, secteur, reponses } = requete.body;

      await busEvenements.publie(
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
