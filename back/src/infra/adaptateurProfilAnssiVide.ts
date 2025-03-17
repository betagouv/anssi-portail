import { AdaptateurProfilAnssi } from "./adaptateurProfilAnssi";

export const adaptateurProfilAnssiVide = (): AdaptateurProfilAnssi => ({
  recupere: async () => ({
    email: '',
    prenom: '',
    nom: '',
    telephone: '',
    domainesSpecialite: [],
    organisation: { nom: '', siret: '', departement: '' },
  }),
  metsAJour: async () => {},
});
