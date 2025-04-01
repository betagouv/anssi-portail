import axios from 'axios';
import { adaptateurProfilAnssiVide } from './adaptateurProfilAnssiVide';

const CONFIGURATION_AUTHENTIFICATION = {
  headers: {
    Authorization: `Bearer ${process.env.PROFIL_ANSSI_JETON_API}`,
  },
};

type Organisation = {
  nom: string;
  siret: string;
  departement: string | null;
};

export type ProfilAnssi = {
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  organisation: Organisation;
};

export interface AdaptateurProfilAnssi {
  metsAJour: (profilAnssi: ProfilAnssi) => Promise<void>;
  recupere: (email: string) => Promise<ProfilAnssi | undefined>;
}

const adaptateurProfilAnssi = (): AdaptateurProfilAnssi => {
  const metsAJour = async ({
    nom,
    prenom,
    email,
    organisation,
    telephone,
    domainesSpecialite,
  }: ProfilAnssi) => {
    const urlProfil = `${process.env.PROFIL_ANSSI_URL_BASE}/profil/${email}`;
    await axios.put(
      urlProfil,
      {
        nom,
        prenom,
        organisation,
        telephone,
        domainesSpecialite,
      },
      CONFIGURATION_AUTHENTIFICATION
    );
  };

  const recupere = async (email: string) => {
    const urlProfil = `${process.env.PROFIL_ANSSI_URL_BASE}/profil/${email}`;
    try {
      const reponse = await axios.get(
        urlProfil,
        CONFIGURATION_AUTHENTIFICATION
      );
      return reponse.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status !== 404) {
        console.error({
          'Erreur renvoyée par API MonProfilAnssi': e.response?.data,
          'Statut renvoyé par API MonProfilAnssi': e.response?.status,
        });
      }
      return undefined;
    }
  };

  return { recupere, metsAJour };
};

export const fabriqueAdaptateurProfilAnssi = () =>
  process.env.PROFIL_ANSSI_URL_BASE
    ? adaptateurProfilAnssi()
    : adaptateurProfilAnssiVide();
