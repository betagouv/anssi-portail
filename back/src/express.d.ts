declare namespace Express {
  export interface Request {
    emailUtilisateurCourant?: string;
    utilisateur: Utilisateur | undefined;
  }

  export type CorpsDeRequeteTypee<T> = import('express').Request<Record<string, unknown>, unknown, T>;

  export interface Response {
    envoieFichierEnrichi: (chemin: string) => Promise<void>;
  }
}
