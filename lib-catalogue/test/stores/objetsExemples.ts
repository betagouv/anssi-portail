import { ItemCyber } from "../../src/Catalogue.types";

export const mss = (): ItemCyber => ({
  nom: "mss",
  description: "Pour sécuriser",
  illustration: "mss.png",
  lienInterne: "https://...",
  besoins: ["RENFORCER_LA_SECURITE"],
  sources: [],
});

export const demainSpecialisteCyber = (): ItemCyber => ({
  nom: "DemainSpécialisteCyber",
  description: "Former…",
  illustration: "mss.png",
  lienInterne: "https://...",
  besoins: ["SENSIBILISER_ET_FORMER"],
  sources: [],
});

export const livretEnJeux = (): ItemCyber => ({
  nom: "enjeux",
  description: "",
  illustration: "livret.png",
  lienInterne: "https://...",
  besoins: ["SENSIBILISER_ET_FORMER"],
  sources: [],
});
