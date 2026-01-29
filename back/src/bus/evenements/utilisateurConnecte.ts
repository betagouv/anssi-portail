export class UtilisateurConnecte {
  constructor(
    readonly emailHache: string,
    readonly connexionAvecMFA: boolean
  ) {}
}
