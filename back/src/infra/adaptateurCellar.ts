export interface AdaptateurCellar {
  get(chemin: string): Promise<Buffer>;
}

export const adaptateurCellar: AdaptateurCellar = {
  async get(_chemin: string): Promise<Buffer> {
    throw new Error('Méthode non implémentée.');
  },
};
