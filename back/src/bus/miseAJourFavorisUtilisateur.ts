export class MiseAJourFavorisUtilisateur {
  email!: string;
  listeIdFavoris: string[];

  constructor({
    email,
    listeIdFavoris,
  }: {
    email: string;
    listeIdFavoris: string[];
  }) {
    this.email = email;
    this.listeIdFavoris = listeIdFavoris;
  }
}
