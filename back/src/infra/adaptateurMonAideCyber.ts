export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}
export type DemandeAide = {
  email: string;
};

export const fabriqueAdaptateurMonAideCyber = () => ({
  creeDemandeAide: async () => {},
});
