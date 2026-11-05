export interface Rapporteur {
  erreur(erreur: unknown, message?: string): void;
}
