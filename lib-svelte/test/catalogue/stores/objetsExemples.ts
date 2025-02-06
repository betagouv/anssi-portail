import {
  BesoinCyber,
  DroitAcces,
  FormatRessource,
  ItemCyber,
  Source,
  Typologie,
} from "../../../src/catalogue/Catalogue.types";

export const mss = (): ItemCyber => ({
  typologie: Typologie.SERVICE,
  nom: "mss",
  description: "Pour sécuriser",
  illustration: "mss.png",
  lienInterne: "https://...",
  lienExterne: "https://...",
  besoins: [BesoinCyber.SECURISER],
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ENTITES_PUBLIQUES],
});

export const demainSpecialisteCyber = (): ItemCyber => ({
  typologie: Typologie.SERVICE,
  nom: "DemainSpécialisteCyber",
  description: "Former…",
  illustration: "mss.png",
  lienInterne: "https://...",
  lienExterne: "https://...",
  besoins: [BesoinCyber.ETRE_SENSIBILISE],
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
  lienExterne: "https://...",
  besoins: [BesoinCyber.SECURISER],
  sources: [Source.ANSSI, Source.INNOVATION_ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE, DroitAcces.REGULES_NIS2],
});

export const livretEnJeux = (): ItemCyber => ({
  typologie: Typologie.RESSOURCE,
  nom: "enjeux",
  format: FormatRessource.OUTIL,
  description: "",
  illustration: "livret.png",
  lienInterne: "https://...",
  lienExterne: "https://...",
  besoins: [BesoinCyber.ETRE_SENSIBILISE],
  sources: [Source.ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const guidesTechniques = (): ItemCyber => ({
  typologie: Typologie.RESSOURCE,
  nom: "Guides techniques",
  format: FormatRessource.PUBLICATION,
  description: "",
  illustration: "guide.png",
  lienInterne: "https://...",
  lienExterne: "https://...",
  besoins: [BesoinCyber.SECURISER],
  sources: [Source.ANSSI],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});

export const kitCyber = (): ItemCyber => ({
  typologie: Typologie.RESSOURCE,
  nom: "KIT CYBER",
  format: FormatRessource.PUBLICATION,
  description: "",
  illustration: "kit.png",
  lienInterne: "https://...",
  lienExterne: "https://...",
  besoins: [BesoinCyber.SE_FORMER],
  sources: ["Gendarmerie"],
  droitsAcces: [DroitAcces.ACCES_LIBRE],
});
