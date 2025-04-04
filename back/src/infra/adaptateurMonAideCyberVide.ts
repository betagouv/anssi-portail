import { AdaptateurMonAideCyber, DemandeAide } from './adaptateurMonAideCyber';

export const adaptateurMonAideCyberVide = (): AdaptateurMonAideCyber => ({
  creeDemandeAide: async (_demandeAide: DemandeAide) => {},
});
