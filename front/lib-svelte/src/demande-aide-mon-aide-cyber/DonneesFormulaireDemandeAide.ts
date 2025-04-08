import type { OrganisationDisponible } from '../ui/formulaire/SelectionOrganisation.types';

export type DonneesFormulaireDemandeAide = {
  email: string;
  emailUtilisateur: string;
  entite: OrganisationDisponible;
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
