import { NiveauDeSatisfaction } from './niveauDeSatisfaction.js';

export type RetourExperience = {
  raison: string;
  precision?: string;
  emailDeContact?: string;
};

export type AvisUtilisateur = {
  niveauDeSatisfaction: NiveauDeSatisfaction;
  commentaire: string;
  emailDeContact?: string;
};

export type AvisNegatifSurUneMesure = {
  idMesure: string;
  titreMesure: string;
  commentaire?: string;
};

export interface MessagerieInstantanee {
  notifieUnAvisUtilisateur(avisUtilisateur: AvisUtilisateur): Promise<void>;
  notifieUnRetourExperience(retourExperience: RetourExperience): Promise<void>;
  notifieUnAvisNegatifSurUneMesure(avis: AvisNegatifSurUneMesure): Promise<void>;
}
