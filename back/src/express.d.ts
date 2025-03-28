declare namespace Express {
  export interface Request {
    emailUtilisateurCourant?: string;
  }

  export interface Response {
    sendFileAvecNonce: (chemin: string) => void;
  }
}
