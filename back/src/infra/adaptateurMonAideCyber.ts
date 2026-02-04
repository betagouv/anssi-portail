import axios from 'axios';
import { adaptateurMonAideCyberVide } from './adaptateurMonAideCyberVide';
import { Cache } from './cache';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement';

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

export type StatistiquesMonAideCyber = { nombreDiagnostics: number };

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
  statistiques: () => Promise<StatistiquesMonAideCyber>;
}

class AdaptateurHttpMonAideCyber implements AdaptateurMonAideCyber {
  private cacheStatistiques: Cache<Promise<StatistiquesMonAideCyber>>;
  constructor(
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {
    this.cacheStatistiques = new Cache({
      ttl: adaptateurEnvironnement
        .monAideCyber()
        .dureeCacheStatistiquesEnSecondes(),
    });
  }

  async creeDemandeAide({ entiteAidee, aidant, origine }: DemandeAide) {
    try {
      const { email, raisonSociale, departement, siret } = entiteAidee;
      const {
        email: emailAidant,
        identifiant: identifiantAidant,
        siret: siretAidant,
      } = aidant;
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
      await axios.post(
        `${this.adaptateurEnvironnement.monAideCyber().url()}/api/demandes/etre-aide`,
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
  }

  async statistiques(): Promise<StatistiquesMonAideCyber> {
    const url = `${this.adaptateurEnvironnement.monAideCyber().url()}/api/statistiques`;
    return this.cacheStatistiques.get(url, async () => {
      const reponse = await axios.get(url.toString());
      return { nombreDiagnostics: reponse.data.nombreDiagnostics };
    });
  }
}

export const fabriqueAdaptateurMonAideCyber = (
  adaptateurEnvironnement: AdaptateurEnvironnement
) =>
  process.env.MON_AIDE_CYBER_URL_BASE
    ? new AdaptateurHttpMonAideCyber(adaptateurEnvironnement)
    : adaptateurMonAideCyberVide();
