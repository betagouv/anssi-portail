import { RegleEntiteOSE } from './regles/RegleEntiteOSE';
import { estValeurVide, type Regle, Specifications } from './Specifications';
import { RegleLocalisation } from './regles/RegleLocalisation';
import type { SpecificationTexte } from './FormatDesSpecificationsCSV';
import { RegleTypeDeStructure } from './regles/RegleTypeDeStructure';
import { RegleTaille } from './regles/RegleTaille';
import { ErreurLectureDeRegle } from './regles/ErreurLectureDeRegle';
import { RegleSecteurs } from './regles/RegleSecteurs';
import { RegleSousSecteurs } from './regles/RegleSousSecteurs';
import { RegleActivites } from './regles/RegleActivites';
import { RegleFournitureDeServicesNumerique } from './regles/RegleFournitureDeServicesNumerique';
import { RegleEtablissementPrincipal } from './regles/RegleEtablissementPrincipal';
import {
  CodesPrecisionsPointsAttention,
  CodesResumesPointsAttention,
  type PointsAttentionPrecis,
  type ResultatEligibilite,
  type ResumesPointsAttention,
} from '../Regulation.definitions';

export class FabriqueDeSpecifications {
  transforme(texte: SpecificationTexte): Specifications {
    const regles: Regle[] = [
      RegleEntiteOSE.nouvelle(texte),
      RegleLocalisation.nouvelle(texte),
      RegleTypeDeStructure.nouvelle(texte),
      RegleTaille.nouvelle(texte),
      RegleSecteurs.nouvelle(texte),
      RegleSousSecteurs.nouvelle(texte),
      RegleActivites.nouvelle(texte),
      RegleFournitureDeServicesNumerique.nouvelle(texte),
      RegleEtablissementPrincipal.nouvelle(texte),
    ].filter((s) => s !== undefined) as Regle[];

    const resultat = this.transformeResultat(texte);

    return new Specifications(regles, resultat, texte['Code']);
  }

  private transformeResultat(texte: SpecificationTexte): ResultatEligibilite {
    const valeur = texte['Resultat'];

    const pointsAttention = this.getPointsAttention(texte);

    if (valeur === 'Régulée EE')
      return {
        regulation: 'Regule',
        typeEntite: 'EntiteEssentielle',
        pointsAttention,
      };

    if (valeur === 'Régulée EI')
      return {
        regulation: 'Regule',
        typeEntite: 'EntiteImportante',
        pointsAttention,
      };

    if (valeur === 'Régulée, enregistrement seul')
      return {
        regulation: 'Regule',
        typeEntite: 'EnregistrementUniquement',
        pointsAttention,
      };

    if (valeur === 'Régulée, sans précision EE/EI')
      return {
        regulation: 'Regule',
        typeEntite: 'AutreEtatMembreUE',
        pointsAttention,
      };

    if (valeur === 'Non régulée')
      return {
        regulation: 'NonRegule',
        typeEntite: 'AutreEtatMembreUE', // Le type est sans importance ici.
        pointsAttention,
      };

    if (valeur === 'Incertain')
      return {
        regulation: 'Incertain',
        typeEntite: 'AutreEtatMembreUE', // Le type est sans importance ici.
        pointsAttention,
      };

    throw new ErreurLectureDeRegle(valeur, 'Resultat');
  }

  private getPointsAttention = (
    texte: SpecificationTexte
  ): {
    resumes: ResumesPointsAttention[];
    precisions: PointsAttentionPrecis[];
  } => {
    const valeur = texte["Points d'attention"];

    if (estValeurVide(valeur)) return { resumes: [], precisions: [] };

    const nettoyees = valeur.split(',').map((v) => v.trim().replace('#', ''));

    const inconnus = nettoyees.filter(
      (v) => !CodesResumesPointsAttention.includes(v) && !CodesPrecisionsPointsAttention.includes(v)
    );
    if (inconnus.length > 0) throw new ErreurLectureDeRegle(inconnus.join(','), "Points d'attention");

    const resumes: ResumesPointsAttention[] = [];
    const precisions: PointsAttentionPrecis[] = [];
    for (const v of nettoyees) {
      if (CodesResumesPointsAttention.includes(v)) resumes.push(v);
      if (CodesPrecisionsPointsAttention.includes(v)) precisions.push(v);
    }

    return { precisions, resumes };
  };
}
