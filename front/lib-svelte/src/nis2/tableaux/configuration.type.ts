import type { Snippet } from 'svelte';
import type {
  Exigence,
  ExigenceComparee,
  ReferentielSelectionne,
} from '../exigence.type';

export type Comparaison =
  | `COMPARAISON_NIS2_${ReferentielSelectionne}`
  | `COMPARAISON_${ReferentielSelectionne}_NIS2`;

export type ConfigurationTableauComparaison = Record<
  Comparaison,
  {
    titreColonneSource: string;
    titreColonneCible: string;
    colonneSource: Snippet<[Exigence]>;
    colonneCible: Snippet<[ExigenceComparee[]]>;
  }
>;
