export class CompteCree {
  email!: string;
  prenom!: string;
  nom!: string;
  infoLettre!: boolean;
  telephone?: string;

  constructor({
    email,
    prenom,
    nom,
    infoLettre,
    telephone,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    telephone?: string;
  }) {
    this.email = email;
    this.prenom = prenom;
    this.nom = nom;
    this.infoLettre = infoLettre;
    this.telephone = telephone;
  }
}
