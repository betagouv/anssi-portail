import axios from 'axios';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide';

export type DemandeAide = {
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
  };
  emailAidant?: string;
  validationCGU: boolean;
};

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}

const adaptateurMonAideCyber = (): AdaptateurMonAideCyber => {
  const creeDemandeAide = async ({ entiteAidee }: DemandeAide) => {
    await axios.post(
      `${process.env.MON_AIDE_CYBER_URL_BASE}/api/demandes/dummy-etre-aide`,
      { email: entiteAidee.email }
    );
  };

  return { creeDemandeAide };
};

export const fabriqueAdaptateurMonAideCyber = () =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? adaptateurMonAideCyber()
    : adaptateurMonAideCyberVide();
