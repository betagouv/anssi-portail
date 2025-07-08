import { AdaptateurMonAideCyber, DemandeAide } from './adaptateurMonAideCyber';

export const adaptateurMonAideCyberVide = (): AdaptateurMonAideCyber => ({
  creeDemandeAide: async (_demandeAide: DemandeAide) => {},
  statistiques: async () => ({ nombreDiagnostics: 0 }),
});
