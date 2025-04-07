import axios from 'axios';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide';

export type DemandeAide = {
  email: string;
  emailAidant?: string;
  departement: string;
  raisonSociale: string
};

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}

const adaptateurMonAideCyber = (): AdaptateurMonAideCyber => {
  const creeDemandeAide = async ({ email }: DemandeAide) => {
    await axios.post(
      `${process.env.MON_AIDE_CYBER_URL_BASE}/api/demandes/dummy-etre-aide`,
      {
        email,
      }
    );
  };

  return { creeDemandeAide };
};

export const fabriqueAdaptateurMonAideCyber = () =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? adaptateurMonAideCyber()
    : adaptateurMonAideCyberVide();
