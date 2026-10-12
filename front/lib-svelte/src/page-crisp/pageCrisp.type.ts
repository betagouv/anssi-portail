export type EntreeTableDesMatieres = {
  profondeur: number;
  texte: string;
  id: string;
};

export type PageHtmlCrisp = {
  titre: string;
  contenu: string | null;
  description: string | null;
  tableDesMatieres: EntreeTableDesMatieres[];
};
