export type KitRelais = {
  titre: string;
  description: string;
  contenu: string;
  tableDesMatières: { profondeur: number; texte: string; id: string }[];
};
