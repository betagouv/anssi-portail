import axios from 'axios';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide';

export type DemandeAide = {
  origine?: string;
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
    siret: string;
  };
  aidant: {
    email?: string;
    identifiant?: string;
  };
};

export type StatistiquesMonAideCyber = { nombreDiagnostics: number };

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
  statistiques: () => Promise<StatistiquesMonAideCyber>;
}

const adaptateurMonAideCyber = (): AdaptateurMonAideCyber => {
  const creeDemandeAide = async ({
    entiteAidee,
    aidant,
    origine,
  }: DemandeAide) => {
    try {
      const { email, raisonSociale, departement, siret } = entiteAidee;
      const { email: emailAidant, identifiant: identifiantAidant } = aidant;
      const demandeMAC = {
        ...(origine && { origine }),
        cguValidees: true,
        email,
        departement,
        raisonSociale,
        siret,
        ...(emailAidant && { relationUtilisateur: emailAidant }),
        ...(identifiantAidant && { identifiantAidant }),
      };
      await axios.post(
        `${process.env.MON_AIDE_CYBER_URL_BASE}/api/demandes/etre-aide`,
        demandeMAC
      );
    } catch (e: unknown | Error) {
      if (
        axios.isAxiosError(e) &&
        e.response &&
        e.response.status >= 400 &&
        e.response.status < 500
      ) {
        throw new Error(e.response.data.message);
      }
      throw e;
    }
  };

  const statistiques = async (): Promise<StatistiquesMonAideCyber> => {
    try {
      const reponse = await axios.get(
        `${process.env.MON_AIDE_CYBER_URL_BASE}/api/statistiques`
      );
      return { nombreDiagnostics: reponse.data.nombreDiagnostics };
    } catch (e: unknown | Error) {
      if (
        axios.isAxiosError(e) &&
        e.response &&
        e.response.status >= 400 &&
        e.response.status < 500
      ) {
        throw new Error(e.response.data.message);
      }
      throw e;
    }
  };

  return { creeDemandeAide, statistiques };
};

export const fabriqueAdaptateurMonAideCyber = () =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? adaptateurMonAideCyber()
    : adaptateurMonAideCyberVide();
