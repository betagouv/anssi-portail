import { CodeRegion, regionParNom } from './referentielRegions';

export class Financement {
  id: number;
  nom: string;
  financeur: string;
  typesDeFinancement: string[];
  entitesElligibles: string[];
  perimetreGeographique: string[];
  regions: Array<CodeRegion | 'FRANCE'>;
  objectifs: string;
  operationsElligibles: string;
  benificiaires: string;
  montant: string;
  sources: string[];
  contact: string;

  constructor({
    id,
    nom,
    financeur,
    typesDeFinancement,
    entitesElligibles,
    perimetreGeographique,
    regions,
    objectifs,
    operationsElligibles,
    benificiaires,
    montant,
    sources,
    contact,
  }: {
    id: number;
    nom: string;
    financeur: string;
    entitesElligibles: string[];
    typesDeFinancement: string[];
    perimetreGeographique: string[];
    regions: string[];
    objectifs: string;
    operationsElligibles: string;
    benificiaires: string;
    montant: string;
    sources: string[];
    contact: string;
  }) {
    this.id = id;
    this.nom = nom;
    this.financeur = financeur;
    this.typesDeFinancement = typesDeFinancement;
    this.entitesElligibles = entitesElligibles;
    this.perimetreGeographique = perimetreGeographique;
    this.objectifs = objectifs;
    this.operationsElligibles = operationsElligibles;
    this.benificiaires = benificiaires;
    this.montant = montant;
    this.sources = sources;
    this.contact = contact;
    this.regions = regions.includes('France')
      ? ['FRANCE']
      : regions
          .map((region) => regionParNom(region)?.codeIso)
          .filter((codeRegion) => !!codeRegion);
  }
}
