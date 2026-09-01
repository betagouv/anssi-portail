export const identifiantsMiniTest = ['VraiFaux', 'MaturiteCyber'] as const;
export type IdentifiantMiniTest = (typeof identifiantsMiniTest)[number];

export const typesRéaction = ['❤️', '🔥', '👍'] as const;
export type TypeRéaction = (typeof typesRéaction)[number];

export type CléReactionMiniTest = `${IdentifiantMiniTest}:${TypeRéaction}`;

export const cléReactionMiniTest = (miniTest: IdentifiantMiniTest, typeReaction: TypeRéaction): CléReactionMiniTest =>
  `${miniTest}:${typeReaction}`;

export class RéactionMiniTest {
  private _compteur: number;

  constructor(
    public readonly id: IdentifiantMiniTest,
    public readonly typeRéaction: TypeRéaction,
    compteur: number
  ) {
    this._compteur = compteur;
  }

  public get compteur(): number {
    return this._compteur;
  }

  ajoute(): void {
    this._compteur++;
  }

  retire(): void {
    this._compteur = Math.max(0, this._compteur - 1);
  }
}
