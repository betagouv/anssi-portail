export class MiseAJourFavorisUtilisateur {
  email!: string;

  constructor({ email }: { email: string }) {
    this.email = email;
  }
}
