import { CodeRegion, regionParNom } from './referentielRegions';

export class Financement {
  id: number;
  nom: string;
  financeur: string;
  typesDeFinancement: string[];
  entitesElligibles: string[];
  perimetresGeographiques: string[];
  regions: Array<CodeRegion | 'FRANCE'>;
  objectifs: string;
  operationsEligibles: string;
  benificiaires: string;
  montant: string;
  condition: string;
  sources: string[];
  contact: string;

  constructor({
    id,
    nom,
    financeur,
    typesDeFinancement,
    entitesElligibles,
    perimetresGeographiques,
    regions,
    objectifs,
    operationsEligibles,
    benificiaires,
    montant,
    condition,
    sources,
    contact,
  }: {
    id: number;
    nom: string;
    financeur: string;
    entitesElligibles: string[];
    typesDeFinancement: string[];
    perimetresGeographiques: string[];
    regions: string[];
    objectifs: string;
    operationsEligibles: string;
    benificiaires: string;
    montant: string;
    condition: string;
    sources: string[];
    contact: string;
  }) {
    this.id = id;
    this.nom = nom;
    this.financeur = financeur;
    this.typesDeFinancement = typesDeFinancement;
    this.entitesElligibles = entitesElligibles;
    this.perimetresGeographiques = perimetresGeographiques;
    this.objectifs = objectifs;
    this.operationsEligibles = operationsEligibles;
    this.benificiaires = benificiaires;
    this.montant = montant;
    this.condition = condition;
    this.sources = sources;
    this.contact = contact;
    this.regions = regions.includes('France')
      ? ['FRANCE']
      : regions
          .map((region) => regionParNom(region)?.codeIso)
          .filter((codeRegion) => !!codeRegion);
  }
}
