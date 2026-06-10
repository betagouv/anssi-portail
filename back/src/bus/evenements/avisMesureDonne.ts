type Retour = 'POSITIF' | 'NEGATIF';

export class AvisMesureDonne {
  idUtilisateur: string;
  idMesure: string;
  retour: Retour;
  commentaire?: string;

  constructor({
    idUtilisateur,
    idMesure,
    retour,
    commentaire,
  }: {
    idUtilisateur: string;
    idMesure: string;
    retour: Retour;
    commentaire?: string;
  }) {
    this.idUtilisateur = idUtilisateur;
    this.idMesure = idMesure;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
