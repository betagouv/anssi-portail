import { FacteurAggravant, Secteur, TypeOrganisation } from '../../metier/mini-tests/exposition/exposition.js';
import { CodeRegion } from '../../metier/referentielRegions.js';
import { CodeSecteur } from '../../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { EvenementDuBus } from '../busEvenements.js';

export class TestExpositionRéalisé implements EvenementDuBus {
  constructor(
    public readonly typeOrganisation: TypeOrganisation,
    readonly secteur: Secteur,
    readonly facteursAggravant: FacteurAggravant[],
    readonly email?: string,
    readonly codeRegion?: CodeRegion,
    readonly codeSecteur?: CodeSecteur,
    readonly codeTrancheEffectif?: CodeTrancheEffectif
  ) {}
}
