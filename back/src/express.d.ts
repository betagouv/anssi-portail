declare namespace Express {
  export interface Request {
    emailUtilisateurCourant?: string;
    utilisateur: Utilisateur | undefined;
  }

  export interface CorpsDeRequeteTypee<T> extends Request {
    body: T;
  }

  export interface Response {
    sendFileAvecNonce: (chemin: string) => void;
  }
}
