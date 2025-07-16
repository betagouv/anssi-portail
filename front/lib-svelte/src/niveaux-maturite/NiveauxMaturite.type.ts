export type IdNiveau =
  | 'insuffisant'
  | 'emergent'
  | 'intermediaire'
  | 'confirme'
  | 'optimal';

export type NiveauMaturite = {
  id: IdNiveau;
  label: string;
  description: string;
  priorite: string;
  priseEnCompteRisque: string;
  posture: string;
  pilotage: string;
  ressourcesHumaines: string;
  budget: string;
  adoptionSolutions: string;
  niveauSecurite: string;
};
