import { NiveauDUtilité } from './niveauDeSatisfaction.js';
import { Parcours } from './parcours.js';

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
