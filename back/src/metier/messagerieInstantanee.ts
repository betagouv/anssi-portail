import { NiveauDeSatisfaction } from './niveauDeSatisfaction';

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

export interface MessagerieInstantanee {
  notifieUnRetourExperience(retourExperience: RetourExperience): Promise<void>;
}
