import { Request, Response, Router } from 'express';
import {
  IdNiveauMaturite,
  IdRubrique,
  tousLesIdRubrique,
} from '../../metier/resultatTestMaturite';
import { ConfigurationServeur } from '../configurationServeur';

type Serie = {
  id: IdNiveauMaturite;
  valeurs: Record<IdRubrique, number[]>;
};

export const ressourceRepartitionDesResultatsDeTest = ({
  entrepotResultatTest,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    const tousLesResultats =
      await entrepotResultatTest.tousEnOmettantUtilisateur();
    const series = tousLesResultats.reduce((accumulateur, test) => {
      const niveau = test.niveau();
      let serieCourante = accumulateur.find((serie) => serie.id === niveau);
      if (!serieCourante) {
        serieCourante = {
          id: niveau,
          valeurs: tousLesIdRubrique.reduce(
            (rubriqueAccumulateur, rubrique) => {
              return {
                ...rubriqueAccumulateur,
                [rubrique]: [],
              };
            },
            {}
          ),
        };
        accumulateur.push(serieCourante);
      }
      tousLesIdRubrique.forEach((rubrique) => {
        serieCourante.valeurs[rubrique].push(test.reponses[rubrique]);
      });
      return accumulateur;
    }, [] as Serie[]);

    const calculeValeurMoyenne = (
      idRubrique: IdRubrique,
      serie: Serie
    ): number => {
      return (
        serie.valeurs[idRubrique].reduce((accumulateur, valeur) => {
          return accumulateur + valeur;
        }, 0) / serie.valeurs[idRubrique].length
      );
    };
    const seriesMoyenne = series.map((serie) => ({
      id: serie.id,
      valeurs: {
        'adoption-solutions': calculeValeurMoyenne('adoption-solutions', serie),
        'prise-en-compte-risque': calculeValeurMoyenne(
          'prise-en-compte-risque',
          serie
        ),
        'ressources-humaines': calculeValeurMoyenne(
          'ressources-humaines',
          serie
        ),
        budget: calculeValeurMoyenne('budget', serie),
        pilotage: calculeValeurMoyenne('pilotage', serie),
        posture: calculeValeurMoyenne('posture', serie),
      },
      totalNombreTests: serie.valeurs['adoption-solutions'].length,
    }));
    reponse.send(seriesMoyenne);
  });
  return routeur;
};
