import { Financement } from '../metier/financement';

export interface AdaptateurSourceExterne {
  parId(id: Financement['id']): Promise<Financement | undefined>;
}

export const adaptateurAPIAidesEntreprises: AdaptateurSourceExterne = {
  parId: async () => undefined,
};
