export type ItemCyber = {
  nom: string;
  illustration: string;
  description: string;
  lienInterne: string;
  sources: string[];
  besoins: BesoinCyber[];
};

export type BesoinCyber =
  | "REAGIR"
  | "SENSIBILISER_ET_FORMER"
  | "RENFORCER_LA_SECURITE";
