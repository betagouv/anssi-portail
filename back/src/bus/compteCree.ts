export class CompteCree {
  email!: string;
  prenom!: string;

  constructor({ email, prenom }: { email: string; prenom: string }) {
    this.email = email;
    this.prenom = prenom;
  }
}
