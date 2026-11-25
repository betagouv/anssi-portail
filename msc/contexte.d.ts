import type { ProfilNavigation } from '../front/lib-svelte/src/stores/profil.js';

export interface ContexteMSC {
  profil?: ProfilNavigation;
  maintenance?: { jour: string; heure: string };
  rapporteur: { erreur(erreur: unknown, message?: string): void };
  politiqueDeSécurité: string;
}
