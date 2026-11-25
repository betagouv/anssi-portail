export interface ContexteMSC {
  rapporteur: { erreur(erreur: unknown, message?: string): void };
  politiqueDeSécurité: string;
}
