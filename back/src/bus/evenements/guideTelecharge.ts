export class GuideTelecharge {
  readonly id: string;
  readonly nom: string;

  constructor({ id, nom }: { id: string; nom: string }) {
    this.id = id;
    this.nom = nom;
  }
}
