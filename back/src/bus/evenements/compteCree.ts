export class CompteCree {
  email!: string;
  prenom!: string;
  nom!: string;
  infoLettre!: boolean;
  telephone?: string;
  pixelDeSuiviAccepté: boolean;

  constructor({
    email,
    prenom,
    nom,
    infoLettre,
    telephone,
    pixelDeSuiviAccepté,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    telephone?: string;
    pixelDeSuiviAccepté: boolean;
  }) {
    this.email = email;
    this.prenom = prenom;
    this.nom = nom;
    this.infoLettre = infoLettre;
    this.telephone = telephone;
    this.pixelDeSuiviAccepté = pixelDeSuiviAccepté;
  }
}
