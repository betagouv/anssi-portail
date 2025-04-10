import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';

export type DonneesFormulaireDemandeAide = {
  email: string;
  emailAidant: string;
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
  validationCGU: boolean;
};
