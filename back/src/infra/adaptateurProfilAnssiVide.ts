import { AdaptateurProfilAnssi } from "./adaptateurProfilAnssi";

export const adaptateurProfilAnssiVide = (): AdaptateurProfilAnssi => (
{
  recupere: async () => undefined,
  metsAJour: async () => {},
});
