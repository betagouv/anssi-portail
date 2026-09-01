export type QuestionVraieFausse = {
  idQuestion: string | number;
  libellé: {
    emoji: string;
    texte: string;
  };
  idéeReçue: string;
  explications: string;
  source: string;
  estVraie: boolean;
};
