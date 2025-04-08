import axios from 'axios';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide';

export type DemandeAide = {
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
  };
  emailAidant?: string;
};

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}

const adaptateurMonAideCyber = (): AdaptateurMonAideCyber => {
  const creeDemandeAide = async ({ entiteAidee, emailAidant }: DemandeAide) => {
    const { email, raisonSociale, departement } = entiteAidee;
    const demandeMAC = {
      cguValidees: true,
      email,
      departement,
      raisonSociale,
      ...(emailAidant && { relationUtilisateur: emailAidant }),
    };
    await axios.post(
      `${process.env.MON_AIDE_CYBER_URL_BASE}/api/demandes/dummy-etre-aide`,
      demandeMAC
    );
  };

  return { creeDemandeAide };
};

export const fabriqueAdaptateurMonAideCyber = () =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? adaptateurMonAideCyber()
    : adaptateurMonAideCyberVide();
