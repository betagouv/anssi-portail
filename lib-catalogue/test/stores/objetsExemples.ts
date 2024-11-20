import {BesoinCyber, DroitAcces, ItemCyber} from "../../src/Catalogue.types";

export const mss = (): ItemCyber => ({
  nom: "mss",
  description: "Pour sécuriser",
  illustration: "mss.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.RENFORCER_LA_SECURITE],
  sources: [],
  droitsAcces: [DroitAcces.ENTITES_PUBLIQUES],
});

export const demainSpecialisteCyber = (): ItemCyber => ({
  nom: "DemainSpécialisteCyber",
  description: "Former…",
  illustration: "mss.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.SENSIBILISER_ET_FORMER],
  sources: [],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const livretEnJeux = (): ItemCyber => ({
  nom: "enjeux",
  description: "",
  illustration: "livret.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.SENSIBILISER_ET_FORMER],
  sources: [],
  droitsAcces: [],
});
