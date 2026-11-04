export interface RapporteurErreur {
  erreur(erreur: unknown, message?: string): void;
}
