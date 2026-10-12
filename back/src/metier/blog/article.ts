export type EntréeTableDesMatières = {
  id: string;
  texte: string;
  profondeur: number;
};

export type Article = {
  contenu: string;
  dateDeMiseÀJour?: Date;
  dateDePublication?: Date;
  description: string;
  titre: string;
  tableDesMatières: EntréeTableDesMatières[];
};
