import { GenerateurCodeSessionDeGroupe } from './generateurCodeSessionDeGroupe';

export class SessionDeGroupe {
  private constructor(public readonly code: string) {}

  static async cree(
    generateurCodeSessionDeGroupe: GenerateurCodeSessionDeGroupe
  ) {
    const code = await generateurCodeSessionDeGroupe.genere();
    return new SessionDeGroupe(code);
  }
}
