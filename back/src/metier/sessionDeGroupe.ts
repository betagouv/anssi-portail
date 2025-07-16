import { GenerateurCodeSessionDeGroupe } from './generateurCodeSessionDeGroupe';
import { EntrepotResultatTest } from './entrepotResultatTest';
import {
  IdNiveauMaturite,
  IdRubrique,
  ResultatTestMaturite,
  tousLesIdNiveauMaturite,
  tousLesIdRubrique,
} from './resultatTestMaturite';

export type ResumeNiveauMaturite = {
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

const resumeNiveau = (
  resultatsDuNiveau: ResultatTestMaturite[]
): ResumeNiveauMaturite => ({
  total: resultatsDuNiveau.length,
  moyennes: tousLesIdRubrique.reduce(
    (accumulateur, idRubrique) => ({
      ...accumulateur,
      [idRubrique]: moyenne(
        resultatsDuNiveau.map((r) => r.reponses[idRubrique])
      ),
    }),
    {} as Record<IdRubrique, number>
  ),
});

export class SessionDeGroupe {
  constructor(public readonly code: string) {}

  static async cree(
    generateurCodeSessionDeGroupe: GenerateurCodeSessionDeGroupe
  ) {
    const code = await generateurCodeSessionDeGroupe.genere();
    return new SessionDeGroupe(code);
  }

  async resultatSession(
    entrepotResultatTest: EntrepotResultatTest
  ): Promise<ResultatSession> {
    const resultatsTest = await entrepotResultatTest.ceuxDeSessionGroupe(
      this.code
    );

    const resultatsParNiveau: Record<IdNiveauMaturite, ResultatTestMaturite[]> =
      tousLesIdNiveauMaturite.reduce(
        (previousValue, idNiveau) => ({
          ...previousValue,
          [idNiveau]: resultatsTest.filter((r) => r.niveau() === idNiveau),
        }),
        {} as Record<IdNiveauMaturite, ResultatTestMaturite[]>
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
