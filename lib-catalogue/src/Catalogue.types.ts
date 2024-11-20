export type ItemCyber = {
  nom: string;
  illustration: string;
  description: string;
  lienInterne: string;
  sources: string[];
  besoins: BesoinCyber[];
  droitsAcces: DroitAcces[];
};

export enum BesoinCyber {
  REAGIR = "REAGIR",
  SENSIBILISER_ET_FORMER = "SENSIBILISER_ET_FORMER",
  RENFORCER_LA_SECURITE = "RENFORCER_LA_SECURITE",
}

export enum DroitAcces {
  ACCES_LIBRE = "ACCES_LIBRE",
  ENTITES_PUBLIQUES = "ENTITES_PUBLIQUES",
  REGULES_NIS2 = "REGULES_NIS2",
}
