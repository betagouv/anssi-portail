export class ProprieteTestRevendiquee {
  emailUtilisateur!: string;
  idResultatTest!: string;

  constructor({
    emailUtilisateur,
    idResultatTest,
  }: {
    emailUtilisateur: string;
    idResultatTest: string;
  }) {
    this.emailUtilisateur = emailUtilisateur;
    this.idResultatTest = idResultatTest;
  }
}
