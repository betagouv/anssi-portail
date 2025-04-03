export interface AdaptateurMonAideCyber {
  creeDemandeAide: (demandeAide: DemandeAide) => Promise<void>;
}
export interface DemandeAide {
  email: string;
}

export const fabriqueAdaptateurMonAideCyber = () => ({
  creeDemandeAide: async () => {},
});
