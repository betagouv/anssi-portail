import {
  BesoinCyber,
  DroitAcces,
  FormatRessource,
  ItemCyber, Source,
  Typologie,
} from "../../src/Catalogue.types";

export const mss = (): ItemCyber => ({
  typologie: Typologie.SERVICE,
  nom: "mss",
  description: "Pour sécuriser",
  illustration: "mss.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.RENFORCER_LA_SECURITE],
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ENTITES_PUBLIQUES],
});

export const demainSpecialisteCyber = (): ItemCyber => ({
  typologie: Typologie.SERVICE,
  nom: "DemainSpécialisteCyber",
  description: "Former…",
  illustration: "mss.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.SENSIBILISER_ET_FORMER],
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const monEspaceNIS2 = (): ItemCyber => ({
  typologie: Typologie.SERVICE,
  nom: "MonEspaceNIS2",
  description:
    "Se notifier et être guidé dans sa mise en conformité avec la directive NIS 2",
  illustration: "nis2.png",
  lienInterne: "https://nis2",
  besoins: [BesoinCyber.RENFORCER_LA_SECURITE],
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE, DroitAcces.REGULES_NIS2],
});

export const livretEnJeux = (): ItemCyber => ({
  typologie: Typologie.RESSOURCE,
  nom: "enjeux",
  format: FormatRessource.VIDEO,
  description: "",
  illustration: "livret.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.SENSIBILISER_ET_FORMER],
  sources: [Source.ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const guidesTechniques = (): ItemCyber => ({
  typologie: Typologie.RESSOURCE,
  nom: "Guides techniques",
  format: FormatRessource.PDF,
  description: "",
  illustration: "guide.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.RENFORCER_LA_SECURITE],
  sources: [Source.ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const kitCyber = (): ItemCyber => ({
  typologie: Typologie.RESSOURCE,
  nom: "KIT CYBER",
  format: FormatRessource.PDF,
  description: "",
  illustration: "kit.png",
  lienInterne: "https://...",
  besoins: [BesoinCyber.SENSIBILISER_ET_FORMER],
  sources: [Source.PARTENAIRES],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});
