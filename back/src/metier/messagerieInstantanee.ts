import { MiniTest } from './mini-tests/mini-test.js';
import { NiveauDeSatisfaction, NiveauDUtilité } from './niveauDeSatisfaction.js';
import { Outil } from './outils/outils.js';
import { Parcours } from './parcours.js';

export type RetourExperience = {
  raison: string;
  precision?: string;
  emailDeContact?: string;
};

export type AvisUtilisateur = {
  niveauDeSatisfaction: NiveauDeSatisfaction;
  commentaire: string;
  emailDeContact?: string;
  pageSource?: string;
};

export type TypeDeRetour = 'spontané' | 'mi-parcours' | 'parcours terminé';

export type AvisParcours = {
  niveauDUtilité: NiveauDUtilité;
  commentaireAmélioration: string;
  souhaiteÊtreRecontacté: boolean;
  parcours: Parcours;
  emailDeContact: string;
  pageSource?: string;
} & (
  | { typeDeRetour: 'mi-parcours'; recommandationAutreOrganisation?: never }
  | { typeDeRetour: Exclude<TypeDeRetour, 'mi-parcours'>; recommandationAutreOrganisation: 'oui' | 'non' | 'peut-être' }
);

export type AvisNegatifSurUneMesure = {
  idMesure: string;
  titreMesure: string;
  commentaire?: string;
};

export type RetourNégatifSurMiniTest = {
  miniTest: MiniTest;
  commentaire?: string;
};

export type RetourNégatifSurArticle = {
  slug: string;
  commentaire?: string;
};

export type RetourNégatifSurOutil = {
  outil: Outil;
  commentaire?: string;
};

export interface MessagerieInstantanee {
  notifieUnAvisUtilisateur(avisUtilisateur: AvisUtilisateur): Promise<void>;
  notifieUnAvisParcours(avisParcours: AvisParcours): Promise<void>;
  notifieUnRetourExperience(retourExperience: RetourExperience): Promise<void>;
  notifieUnAvisNegatifSurUneMesure(avis: AvisNegatifSurUneMesure): Promise<void>;
  notifieUnRetourNégatifSurMiniTest(retour: RetourNégatifSurMiniTest): Promise<void>;
  notifieUnRetourNégatifSurArticle(retour: RetourNégatifSurArticle): Promise<void>;
  notifieUnRetourNégatifSurOutil(retour: RetourNégatifSurOutil): Promise<void>;
}
