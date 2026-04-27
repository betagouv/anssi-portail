import { Router } from 'express';
import {
  Correspondance,
  Exigence,
  ExigenceAvecCorrespondances,
  Langue,
  versLangueConnue,
  versReferentiel,
} from '../../metier/nis2/exigence';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideRequete } from '../zod';
import { schemaRessourceExigencesNis2, schemaRessourceExigencesNis2Query } from './ressourceExigencesNis2.schema';

export const ressourceExigencesNis2 = ({ adaptateurEnvironnement, entrepotExigence }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    valideRequete(schemaRessourceExigencesNis2),
    filetRouteAsynchrone(async (requete, reponse) => {
      const { source, cible, langue } = schemaRessourceExigencesNis2Query.safeParse(requete.query).data ?? {};

      const referentielSource = versReferentiel(source);
      const referentielCible = versReferentiel(cible);
      if (referentielCible !== 'NIS2' && referentielSource !== 'NIS2') {
        return reponse.sendStatus(404);
      }

      if (
        !adaptateurEnvironnement.fonctionnalites().nis2().afficheCyFun23() &&
        (referentielCible === 'CyFun23' || referentielSource === 'CyFun23')
      ) {
        return reponse.sendStatus(404);
      }

      const exigences = await entrepotExigence.parReferentiel(referentielSource, referentielCible);
      const langueConnue = versLangueConnue(langue as string);
      reponse.send(creerRepresentationExigences(exigences, langueConnue));
    })
  );

  return routeur;
};
function creerRepresentationExigences(exigences: Exigence[], langue: Langue) {
  const exigencesTraduites = (correspondances: Record<string, Correspondance>, referentiel: string) =>
    correspondances[referentiel]?.exigences.map((ec) => ({
      ...ec,
      contenu: langue === 'EN' ? ec.contenuEnAnglais : ec.contenu,
      contenuEnAnglais: undefined,
    }));

  const correspondanceAvecExigencesTraduites = (
    correspondances: Record<string, Correspondance>,
    referentiel: string
  ) =>
    Object.hasOwn(correspondances, referentiel)
      ? {
          [referentiel]: {
            ...correspondances[referentiel],
            exigences: exigencesTraduites(correspondances, referentiel),
          },
        }
      : {};

  return exigences.map((e) => {
    const exigenceAvecCorrespondance = e as unknown as ExigenceAvecCorrespondances;
    const correspondances = exigenceAvecCorrespondance.correspondances;

    return {
      ...e,
      contenu: langue === 'EN' ? e.contenuEnAnglais : e.contenu,
      contenuEnAnglais: undefined,
      correspondances: {
        ...correspondanceAvecExigencesTraduites(correspondances, 'NIS2'),
        ...correspondanceAvecExigencesTraduites(correspondances, 'ISO'),
        ...correspondanceAvecExigencesTraduites(correspondances, 'AE'),
        ...correspondanceAvecExigencesTraduites(correspondances, 'CyFun23'),
      },
    };
  });
}
