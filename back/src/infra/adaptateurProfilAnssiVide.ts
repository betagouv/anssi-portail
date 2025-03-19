import { AdaptateurProfilAnssi } from "./adaptateurProfilAnssi";

export const adaptateurProfilAnssiVide = (): AdaptateurProfilAnssi => ({
  recupere: async () => ({
    prenom: 'Jeanne',
    nom: 'Dupont',
    email: 'jeanne.dupont@mail.fr',
    domainesSpecialite:['RSSI'],
    organisation: {nom:'ANSSI', siret:'12345678901234', departement: '33'}
  }),
  metsAJour: async () => {},
});
