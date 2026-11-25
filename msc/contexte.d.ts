import type { ProfilNavigation } from '../front/lib-svelte/src/stores/profil.js';
import type { EntrepotKitRelais } from './src/lib/kit-relais/server/entrepotKitRelais.js';

export interface ContexteMSC {
  entrepotKitRelais: EntrepotKitRelais;
  sessionAuthentifiée: boolean;
  profil?: ProfilNavigation;
  maintenance?: { jour: string; heure: string };
  rapporteur: { erreur(erreur: unknown, message?: string): void };
  politiqueDeSécurité: string;
}
