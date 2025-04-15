import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';

export type DonneesFormulaireDemandeAide = {
  email: string;
  emailUtilisateurMAC?: string;
  identifiantAidant?: string;
  entite: Organisation;
  cguSontValidees: boolean;
};

export type CorpsAPIDemandeAide = {
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
  };
  emailAidant?: string;
  identifiantAidant?: string;
  validationCGU: boolean;
};
