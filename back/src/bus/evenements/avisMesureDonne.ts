type Retour = 'POSITIF' | 'NEGATIF';

export class AvisMesureDonne {
  idUtilisateur: string;
  idMesure: string;
  titreMesure: string;
  retour: Retour;
  commentaire?: string;

  constructor({
    idUtilisateur,
    idMesure,
    titreMesure,
    retour,
    commentaire,
  }: {
    idUtilisateur: string;
    idMesure: string;
    titreMesure: string;
    retour: Retour;
    commentaire?: string;
  }) {
    this.idUtilisateur = idUtilisateur;
    this.idMesure = idMesure;
    this.titreMesure = titreMesure;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
