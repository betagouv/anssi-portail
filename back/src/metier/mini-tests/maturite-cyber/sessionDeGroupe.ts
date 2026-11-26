import { EntrepôtRésultatTestMaturité } from './entrepotResultatTestMaturite.js';
import { GenerateurCodeSessionDeGroupe } from './generateurCodeSessionDeGroupe.js';
import {
  IdNiveauMaturite,
  IdRubrique,
  RésultatTestMaturité,
  tousLesIdNiveauMaturite,
  tousLesIdRubrique,
} from './resultatTestMaturite.js';

type ResumeNiveauMaturite = {
  total: number;
  moyennes: Record<IdRubrique, number>;
};

export type ResultatSession = {
  nombreParticipants: number;
  resume: Record<IdNiveauMaturite, ResumeNiveauMaturite>;
};

const moyenne = (numbers: number[]) => {
  if (numbers.length === 0) {
    return 0;
  }
  return numbers.reduce((acc, n) => acc + n, 0) / numbers.length;
};

const resumeNiveau = (resultatsDuNiveau: RésultatTestMaturité[]): ResumeNiveauMaturite => ({
  total: resultatsDuNiveau.length,
  moyennes: tousLesIdRubrique.reduce(
    (accumulateur, idRubrique) => ({
      ...accumulateur,
      [idRubrique]: moyenne(resultatsDuNiveau.map((r) => r.reponses[idRubrique])),
    }),
    {} as Record<IdRubrique, number>
  ),
});

export class SessionDeGroupe {
  constructor(public readonly code: string) {}

  static async cree(generateurCodeSessionDeGroupe: GenerateurCodeSessionDeGroupe) {
    const code = await generateurCodeSessionDeGroupe.genere();
    return new SessionDeGroupe(code);
  }

  async resultatSession(entrepotResultatTest: EntrepôtRésultatTestMaturité): Promise<ResultatSession> {
    const resultatsTest = await entrepotResultatTest.ceuxDeSessionGroupe(this.code);

    const resultatsParNiveau: Record<IdNiveauMaturite, RésultatTestMaturité[]> = tousLesIdNiveauMaturite.reduce(
      (previousValue, idNiveau) => ({
        ...previousValue,
        [idNiveau]: resultatsTest.filter((r) => r.niveau() === idNiveau),
      }),
      {} as Record<IdNiveauMaturite, RésultatTestMaturité[]>
    );

    return {
      nombreParticipants: resultatsTest.length,
      resume: tousLesIdNiveauMaturite.reduce(
        (accumulateur, idNiveau) => ({
          ...accumulateur,
          [idNiveau]: resumeNiveau(resultatsParNiveau[idNiveau]),
        }),
        {} as Record<IdNiveauMaturite, ResumeNiveauMaturite>
      ),
    };
  }
}
