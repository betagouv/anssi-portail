export interface ItemCyber {
  typologie: Typologie;
  nom: string;
  illustration: string;
  description: string;
  lienInterne: string;
  sources: string[];
  besoins: BesoinCyber[];
  droitsAcces: DroitAcces[];
  format?: FormatRessource;
  lienExterne: string;
}

export enum BesoinCyber {
  REAGIR = "REAGIR",
  ETRE_SENSIBILISE = "ETRE_SENSIBILISE",
  SE_FORMER = "SE_FORMER",
  SECURISER = "SECURISER",
}

export enum DroitAcces {
  ACCES_LIBRE = "ACCES_LIBRE",
  ENTITES_PUBLIQUES = "ENTITES_PUBLIQUES",
  REGULES_NIS2 = "REGULES_NIS2",
}

export enum Typologie {
  SERVICE = "service",
  RESSOURCE = "ressource",
}

export enum FormatRessource {
  PDF = "PDF",
  VIDEO = "Video",
  LISTES = "Listes",
}

export enum Source {
  ANSSI = "ANSSI",
  CERTFR = "CERT-FR",
  INNOVATION_ANSSI = "Innovation ANSSI",
  PARTENAIRES = "Partenaires",
}