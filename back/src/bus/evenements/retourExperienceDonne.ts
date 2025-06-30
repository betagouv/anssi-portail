export class RetourExperienceDonne {
  raison: string;
  emailDeContact: string | undefined;

  constructor({
    raison,
    emailDeContact,
  }: {
    raison: string;
    emailDeContact?: string;
  }) {
    this.raison = raison;
    this.emailDeContact = emailDeContact;
  }
}
