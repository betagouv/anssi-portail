import { CodeRégion, regionParNom } from './referentielRegions.js';

export class Financement {
  id: number;
  nom: string;
  financeur: string;
  typesDeFinancement: string[];
  entitésÉligibles: string[];
  périmètresGéographiques: string[];
  régions: Array<CodeRégion | 'FRANCE'>;
  objectifs: string;
  opérationsÉligibles: string;
  bénéficiaires: string;
  montant: string;
  condition: string;
  sources: string[];
  contact: string;

  constructor({
    id,
    nom,
    financeur,
    typesDeFinancement,
    entitésÉligibles,
    périmètresGéographiques,
    régions,
    objectifs,
    opérationsÉligibles,
    bénéficiaires,
    montant,
    condition,
    sources,
    contact,
  }: {
    id: number;
    nom: string;
    financeur: string;
    entitésÉligibles: string[];
    typesDeFinancement: string[];
    périmètresGéographiques: string[];
    régions: string[];
    objectifs: string;
    opérationsÉligibles: string;
    bénéficiaires: string;
    montant: string;
    condition: string;
    sources: string[];
    contact: string;
  }) {
    this.id = id;
    this.nom = nom;
    this.financeur = financeur;
    this.typesDeFinancement = typesDeFinancement;
    this.entitésÉligibles = entitésÉligibles;
    this.périmètresGéographiques = périmètresGéographiques;
    this.objectifs = objectifs;
    this.opérationsÉligibles = opérationsÉligibles;
    this.bénéficiaires = bénéficiaires;
    this.montant = montant;
    this.condition = condition;
    this.sources = sources;
    this.contact = contact;
    this.régions = régions.includes('France')
      ? ['FRANCE']
      : régions.map((region) => regionParNom(region)?.codeIso).filter((codeRegion) => !!codeRegion);
  }
}
