import { Parcours } from '../../metier/parcours.js';

type Retour = 'POSITIF' | 'NEGATIF';

export class AvisMesureDonne {
  commentaire?: string;
  idMesure: string;
  idUtilisateur: string;
  parcours?: Parcours;
  retour: Retour;
  titreMesure: string;

  constructor({
    commentaire,
    idMesure,
    idUtilisateur,
    parcours,
    retour,
    titreMesure,
  }: {
    commentaire?: string;
    idMesure: string;
    idUtilisateur: string;
    parcours?: Parcours;
    retour: Retour;
    titreMesure: string;
  }) {
    this.idUtilisateur = idUtilisateur;
    this.idMesure = idMesure;
    this.titreMesure = titreMesure;
    this.parcours = parcours;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
