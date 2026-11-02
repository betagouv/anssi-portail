import { Parcours } from '../../metier/parcours.js';
import { CodeRégion } from '../../metier/referentielRegions.js';
import { CodeSecteur } from '../../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { EvenementDuBus } from '../busEvenements.js';

export class TestHameçonnageTerminé implements EvenementDuBus {
  readonly idCorrélation: string;
  readonly email?: string;
  readonly codeRegion?: CodeRégion;
  readonly codeSecteur?: CodeSecteur;
  readonly codeTrancheEffectif?: CodeTrancheEffectif;
  readonly parcours?: Parcours;

  constructor({
    idCorrélation,
    email,
    codeRegion,
    codeSecteur,
    codeTrancheEffectif,
    parcours,
  }: {
    idCorrélation: string;
    email?: string;
    codeRegion?: CodeRégion;
    codeSecteur?: CodeSecteur;
    codeTrancheEffectif?: CodeTrancheEffectif;
    parcours?: Parcours;
  }) {
    this.idCorrélation = idCorrélation;
    this.email = email;
    this.codeRegion = codeRegion;
    this.codeSecteur = codeSecteur;
    this.codeTrancheEffectif = codeTrancheEffectif;
    this.parcours = parcours;
  }
}
