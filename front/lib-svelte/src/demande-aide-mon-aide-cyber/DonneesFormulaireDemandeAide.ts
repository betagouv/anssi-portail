import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';

export type DonneesFormulaireDemandeAide = {
  email: string;
  emailUtilisateurMAC?: string;
  identifiantAidant?: string;
  entite: Organisation;
  cguSontValidees: boolean;
};

export type CorpsAPIDemandeAide = {
  origine?: string;
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
    siret: string;
  };
  emailAidant?: string;
  identifiantAidant?: string;
  siretAidant?: string;
  validationCGU: boolean;
};
