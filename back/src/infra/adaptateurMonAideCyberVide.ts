import { AdaptateurMonAideCyber, DemandeAide } from './adaptateurMonAideCyber.js';

export const adaptateurMonAideCyberVide = (): AdaptateurMonAideCyber => ({
  creeDemandeAide: async (_demandeAide: DemandeAide) => {},
});
