export type QuestionVraieFausse = {
  idQuestion: string | number;
  idéeReçue: {
    emoji: string;
    texte: string;
  };
  réponse: string;
  explications: string[];
  source: string;
  idéeReçueEstVraie: boolean;
};
