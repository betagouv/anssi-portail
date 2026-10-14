import { FacteurAggravant, Secteur, TypeOrganisation } from '../../metier/mini-tests/exposition/exposition.js';
import { CodeRégion } from '../../metier/referentielRegions.js';
import { CodeSecteur } from '../../metier/referentielSecteurs.js';
import { CodeTrancheEffectif } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { EvenementDuBus } from '../busEvenements.js';

export class TestExpositionRéalisé implements EvenementDuBus {
  constructor(
    public readonly typeOrganisation: TypeOrganisation,
    readonly secteur: Secteur,
    readonly facteursAggravant: FacteurAggravant[],
    readonly email?: string,
    readonly codeRegion?: CodeRégion,
    readonly codeSecteur?: CodeSecteur,
    readonly codeTrancheEffectif?: CodeTrancheEffectif
  ) {}
}
