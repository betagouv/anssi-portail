import { EvenementDuBus } from './busEvenements';

export class TestRealise implements EvenementDuBus {
  region: string;
  secteur: string;
  tailleOrganisation: string;
  reponses: Record<string, number>;

  constructor({
    region,
    secteur,
    tailleOrganisation,
    reponses,
  }: {
    region: string;
    secteur: string;
    tailleOrganisation: string;
    reponses: Record<string, number>;
  }) {
    this.region = region;
    this.secteur = secteur;
    this.tailleOrganisation = tailleOrganisation;
    this.reponses = reponses;
  }
}
