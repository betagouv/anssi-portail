import axios from 'axios';

export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}
export type DemandeAide = {
  email: string;
};

export const fabriqueAdaptateurMonAideCyber = () => ({
  creeDemandeAide: async (demandeAide: DemandeAide) => {
    await axios.post(
      `${process.env.MON_AIDE_CYBER_URL_BASE}/api/demandes/dummy-etre-aide`,
      demandeAide
    );
  },
});
