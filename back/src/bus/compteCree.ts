export class CompteCree {
  email!: string;
  prenom!: string;
  nom!: string;
  infoLettre!: boolean;

  constructor({
    email,
    prenom,
    nom,
    infoLettre,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
  }) {
    this.email = email;
    this.prenom = prenom;
    this.nom = nom;
    this.infoLettre = infoLettre;
  }
}
