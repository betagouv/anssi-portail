import {ConfigurationServeur} from './configurationServeur';
import {Request, Response, Router} from 'express';
import {TestRealise} from '../bus/testRealise';
import {regions} from '../metier/referentielRegions';
import {body, check, validationResult} from 'express-validator';
import {codesSecteur} from '../metier/referentielSecteurs';
import {taillesOrganisation} from '../metier/referentielTailleOrganisation';

const clesReponsesValides = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
];

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
      check('tailleOrganisation').isString().isIn(taillesOrganisation).withMessage("Taille d'organisation invalide"),
      body('reponses').custom(reponses => typeof reponses === 'object' && !Array.isArray(reponses)).withMessage('Les réponses doivent être dans un objet'),
      body('reponses').custom(reponses => Object.keys(reponses).every((cle) => clesReponsesValides.includes(cle))).withMessage('Les clés de réponse sont invalides'),
      body('reponses').custom(reponses => Object.keys(reponses).every((cle) => {
        const valeur = parseInt(reponses[cle]);
        return Number.isInteger(valeur) && valeur >= 1 && valeur <= 5;
      })).withMessage('Les valeurs de réponses doivent être comprises entre 1 et 5')
    ],
    async (requete: Request, reponse: Response) => {
      const {tailleOrganisation, region, secteur, reponses} = requete.body;

      const erreurs = validationResult(requete);
      if (!erreurs.isEmpty()) {
        reponse.status(400).json({erreur: erreurs.array()[0].msg});
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

export {ressourceResultatDeTest};
