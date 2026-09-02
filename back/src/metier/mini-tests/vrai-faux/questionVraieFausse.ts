export type QuestionVraieFausse = {
  idQuestion: string;
  idéeReçue: {
    emoji: string;
    texte: string;
  };
  réponse: string;
  explications: string[];
  source: string;
  idéeReçueEstVraie: boolean;
};
