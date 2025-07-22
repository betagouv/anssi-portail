import { Request, Response, Router } from 'express';
import { body, check } from 'express-validator';
import { ProprieteTestRevendiquee } from '../../bus/evenements/proprieteTestRevendiquee';
import { TestRealise } from '../../bus/evenements/testRealise';
import { codesRegion } from '../../metier/referentielRegions';
import { codesSecteur } from '../../metier/referentielSecteurs';
import { codesTranchesEffectif } from '../../metier/referentielTranchesEffectifEtablissement';
import { ResultatTestMaturite } from '../../metier/resultatTestMaturite';
import { ConfigurationServeur } from '../configurationServeur';

const clesReponsesValides = [
  'prise-en-compte-risque',
  'pilotage',
  'budget',
  'ressources-humaines',
  'adoption-solutions',
  'posture',
];

const ressourceResultatsDeTest = ({
  busEvenements,
  middleware,
  entrepotResultatTest,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    [
      check('region')
        .isString()
        .optional({ values: 'null' })
        .isIn(codesRegion)
        .withMessage('Région invalide'),
      check('secteur')
        .isString()
        .optional({ values: 'null' })
        .isIn(codesSecteur)
        .withMessage('Secteur invalide'),
      check('tailleOrganisation')
        .isString()
        .optional({ values: 'null' })
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
            if (!Number.isInteger(reponses[cle])) {
              return false;
            }
            const valeur = Number(reponses[cle]);
            return valeur >= 1 && valeur <= 5;
          })
        )
        .withMessage(
          'Les valeurs de réponses doivent être comprises entre 1 et 5'
        ),
    ],
    middleware.valide(),
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    middleware.aseptise('codeSessionGroupe'),
    async (requete: Request, reponse: Response) => {
      const {
        tailleOrganisation,
        region,
        secteur,
        reponses,
        codeSessionGroupe,
      } = requete.body;

      const utilisateur = requete.utilisateur;
      const resultatTest = new ResultatTestMaturite({
        tailleOrganisation,
        region,
        secteur,
        reponses,
        codeSessionGroupe,
      });
      if (utilisateur) {
        await resultatTest.revendiquePropriete(
          utilisateur,
          adaptateurRechercheEntreprise
        );
      }

      await entrepotResultatTest.ajoute(resultatTest);

      await busEvenements.publie(
        new TestRealise({
          region: resultatTest.region,
          secteur: resultatTest.secteur,
          tailleOrganisation: resultatTest.tailleOrganisation,
          reponses,
          codeSessionGroupe,
        })
      );
      if (utilisateur) {
        await busEvenements.publie(
          new ProprieteTestRevendiquee({
            idResultatTest: resultatTest.id,
            utilisateur,
          })
        );
      }

      reponse.status(201).send({ id: resultatTest.id });
    }
  );
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    async (requete: Request, reponse: Response) => {
      const resultatsDeTest = await entrepotResultatTest.pourUtilisateur(
        requete.utilisateur
      );

      reponse.send(
        resultatsDeTest.map((resultat) => ({
          id: resultat.id,
          niveau: resultat.niveau(),
          dateRealisation: resultat.dateRealisation,
          reponses: resultat.reponses,
        }))
      );
    }
  );
  return routeur;
};

export { ressourceResultatsDeTest };
