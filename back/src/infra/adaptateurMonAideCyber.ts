import axios from 'axios';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide';

export type DemandeAide = {
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
    siret: string;
  };
  emailAidant?: string;
  identifiantAidant?: string;
};

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}

const adaptateurMonAideCyber = (): AdaptateurMonAideCyber => {
  const creeDemandeAide = async ({ entiteAidee, emailAidant, identifiantAidant }: DemandeAide) => {
    try {
      const { email, raisonSociale, departement, siret } = entiteAidee;
      const demandeMAC = {
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

  return { creeDemandeAide };
};

export const fabriqueAdaptateurMonAideCyber = () =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? adaptateurMonAideCyber()
    : adaptateurMonAideCyberVide();
