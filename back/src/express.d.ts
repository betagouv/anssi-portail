declare namespace Express {
  export interface Request {
    emailUtilisateurCourant?: string;
    utilisateur: Utilisateur | undefined;
  }

  export interface CorpsDeRequeteTypee<T> extends Request {
    body: T;
    params: Record<string, unknown>;
  }

  export interface Response {
    envoieFichierEnrichi: (chemin: string) => Promise<void>;
  }
}
