export type IdItem = string;

export interface Item {
  type: 'ItemCyber' | 'Guide';
  id: IdItem;
  nom: string;
  sources?: string[];
  lienInterne: string;
}

export interface ItemCyber extends Item {
  type: 'ItemCyber';
  typologie: Typologie;
  description: string;
  droitsAcces: DroitAcces[];
  lienExterne: string;
  illustration: string;
}

export enum BesoinCyber {
  REAGIR = 'REAGIR',
  ETRE_SENSIBILISE = 'ETRE_SENSIBILISE',
  SE_FORMER = 'SE_FORMER',
  SECURISER = 'SECURISER',
  TOUS = 'TOUS',
}

export type RepartitionParBesoin = Record<BesoinCyber, IdItem[]>;

export enum DroitAcces {
  ACCES_LIBRE = 'ACCES_LIBRE',
  ENTITES_PUBLIQUES = 'ENTITES_PUBLIQUES',
  REGULES_NIS2 = 'REGULES_NIS2',
}

export enum Typologie {
  SERVICE = 'service',
  OUTIL = "outil",
  CONTENU = "contenu"
}

export enum Source {
  ANSSI_TOUTES = 'ANSSI_TOUTES',
  ANSSI = 'ANSSI',
  CERTFR = 'CERT-FR',
  INNOVATION_ANSSI = 'Innovation ANSSI',
  PARTENAIRES = 'Partenaires',
}
