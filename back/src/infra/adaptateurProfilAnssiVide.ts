import { AdaptateurProfilAnssi } from './adaptateurProfilAnssi';

export const adaptateurProfilAnssiVide = (): AdaptateurProfilAnssi => ({
  recupere: async (email: string) => ({
    prenom: 'Jeanne',
    nom: 'Dupont',
    email,
    domainesSpecialite: ['RSSI'],
    organisation: { nom: 'ANSSI', siret: '13000766900018', departement: '33' },
  }),
  metsAJour: async () => {},
});
