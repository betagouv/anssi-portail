export class Financement {
  nom: string;
  financeur: string;
  entitesElligibles: string[];
  perimetreGeographique: string[];
  régions?: string[];
  objectifs: string;
  operationsElligibles: string;
  benificiaires: string;
  montant: string;
  conditions: string;
  sources: string;

  constructor({
    nom,
    financeur,
    entitesElligibles,
    perimetreGeographique,
    régions,
    objectifs,
    operationsElligibles,
    benificiaires,
    montant,
    conditions,
    sources,
  }: {
    nom: string;
    financeur: string;
    entitesElligibles: string[];
    perimetreGeographique: string[];
    régions?: string[];
    objectifs: string;
    operationsElligibles: string;
    benificiaires: string;
    montant: string;
    conditions: string;
    sources: string;
  }) {
    this.nom = nom;
    this.financeur = financeur;
    this.entitesElligibles = entitesElligibles;
    this.perimetreGeographique = perimetreGeographique;
    this.régions = régions;
    this.objectifs = objectifs;
    this.operationsElligibles = operationsElligibles;
    this.benificiaires = benificiaires;
    this.montant = montant;
    this.conditions = conditions;
    this.sources = sources;
  }
}
