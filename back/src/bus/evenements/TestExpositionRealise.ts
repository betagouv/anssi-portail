import { FacteurAggravant, Secteur, TypeOrganisation } from '../../metier/mini-tests/exposition/exposition.js';
import { EvenementDuBus } from '../busEvenements.js';

export class TestExpositionRéalisé implements EvenementDuBus {
  constructor(
    public readonly typeOrganisation: TypeOrganisation,
    readonly secteur: Secteur,
    readonly facteursAggravant: FacteurAggravant[]
  ) {}
}
