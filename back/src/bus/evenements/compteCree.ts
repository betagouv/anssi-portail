export type payloadDeCréationDeCompte = {
  email: string;
  prenom: string;
  nom: string;
  infoLettre: boolean;
  telephone?: string;
  pixelDeSuiviAccepté: boolean;
  suivi?: { campagne?: string; source?: string; parcoursDestination?: string };
};

export class CompteCree {
  email!: string;
  prenom!: string;
  nom!: string;
  infoLettre!: boolean;
  telephone?: string;
  pixelDeSuiviAccepté: boolean;
  suivi?: {
    campagne?: string;
    source?: string;
    parcoursDestination?: string;
  };

  constructor({ email, prenom, nom, infoLettre, telephone, pixelDeSuiviAccepté, suivi }: payloadDeCréationDeCompte) {
    this.email = email;
    this.prenom = prenom;
    this.nom = nom;
    this.infoLettre = infoLettre;
    this.telephone = telephone;
    this.pixelDeSuiviAccepté = pixelDeSuiviAccepté;
    this.suivi = suivi;
  }
}
