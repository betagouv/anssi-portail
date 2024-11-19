export type ItemCyber = {
  nom: string;
  illustration: string;
  description: string;
  lienInterne: string;
  sources: string[];
  besoins: BesoinCyber[];
  droitsAcces: DroitAcces[];
};

export type BesoinCyber =
  | "REAGIR"
  | "SENSIBILISER_ET_FORMER"
  | "RENFORCER_LA_SECURITE";

export type DroitAcces =
  | "ACCES_LIBRE"
  | "ENTITES_PUBLIQUES"
  | "REGULES_NIS2"