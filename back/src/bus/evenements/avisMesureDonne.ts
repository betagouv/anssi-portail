type Retour = 'POSITIF' | 'NEGATIF';

export class AvisMesureDonne {
  idMesure: string;
  retour: Retour;
  commentaire?: string;

  constructor({ idMesure, retour, commentaire }: { idMesure: string; retour: Retour; commentaire?: string }) {
    this.idMesure = idMesure;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
