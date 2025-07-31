import { NiveauDeSatisfaction } from '../../metier/niveauDeSatisfaction';

export class AvisUtilisateurDonne {
  niveauDeSatisfaction: NiveauDeSatisfaction;
  emailDeContact: string | undefined;

  constructor({
    niveauDeSatisfaction,
    emailDeContact,
  }: {
    niveauDeSatisfaction: NiveauDeSatisfaction;
    emailDeContact?: string;
  }) {
    this.niveauDeSatisfaction = niveauDeSatisfaction;
    this.emailDeContact = emailDeContact;
  }
}
