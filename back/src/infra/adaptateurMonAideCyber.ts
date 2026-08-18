import axios, { isAxiosError } from '@anssi-portail/axios';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide.js';

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
    siret?: string;
  };
};

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}

class AdaptateurHttpMonAideCyber implements AdaptateurMonAideCyber {
  constructor(private readonly adaptateurEnvironnement: AdaptateurEnvironnement) {}

  async creeDemandeAide({ entiteAidee, aidant, origine }: DemandeAide) {
    try {
      const { email, raisonSociale, departement, siret } = entiteAidee;
      const { email: emailAidant, identifiant: identifiantAidant, siret: siretAidant } = aidant;
      const demandeMAC = {
        ...(origine && { origine }),
        cguValidees: true,
        email,
        departement,
        raisonSociale,
        siret,
        ...(emailAidant && { relationUtilisateur: emailAidant }),
        ...(identifiantAidant && { identifiantAidant }),
        ...(siretAidant && { siretAidant }),
      };
      await axios.post(`${this.adaptateurEnvironnement.monAideCyber().url()}/api/demandes/etre-aide`, demandeMAC);
    } catch (e: unknown | Error) {
      if (isAxiosError(e) && e.response && e.response.status >= 400 && e.response.status < 500) {
        throw new Error(e.response.data.message, { cause: e });
      }
      throw e;
    }
  }
}

export const fabriqueAdaptateurMonAideCyber = (adaptateurEnvironnement: AdaptateurEnvironnement) =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? new AdaptateurHttpMonAideCyber(adaptateurEnvironnement)
    : adaptateurMonAideCyberVide();
