import type { SecteurActivite, SecteurComposite } from './SecteurActivite.definitions';
import type { DescriptionSecteur, SousSecteurActivite } from './SousSecteurActivite.definitions';

export const ValeursSousSecteurEnergie = [
  'electricite',
  'gaz',
  'hydrogene',
  'petrole',
  'reseauxChaleurFroid',
  'autreSousSecteurEnergie',
] as const;

export const ValeursSousSecteurTransport = [
  'transportsAeriens',
  'transportsFerroviaires',
  'transportsParEau',
  'transportsRoutiers',
  'autreSousSecteurTransports',
] as const;

export const ValeursSousSecteurFabrication = [
  'fabricationDispositifsMedicaux',
  'fabricationEquipementsElectroniques',
  'fabricationProduitsInformatiquesElectroniquesOptiques',
  'fabricationMachinesEquipements',
  'constructionVehiculesAutomobiles',
  'fabricationAutresMaterielTransports',
  'autreSousSecteurFabrication',
] as const;

export const sousSecteursParSecteur: Record<Extract<SecteurActivite, SecteurComposite>, DescriptionSecteur> = {
  energie: ValeursSousSecteurEnergie,
  transports: ValeursSousSecteurTransport,
  fabrication: ValeursSousSecteurFabrication,
};

export const TousLesSousSecteurs = Object.values(sousSecteursParSecteur).flat() as readonly SousSecteurActivite[];

export const groupementsSecteursParSousSecteurs: Record<SecteurComposite, readonly SousSecteurActivite[]> = {
  energie: ValeursSousSecteurEnergie,
  transports: ValeursSousSecteurTransport,
  fabrication: ValeursSousSecteurFabrication,
};
