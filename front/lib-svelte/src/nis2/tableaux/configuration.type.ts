import type { Snippet } from 'svelte';
import type {
  Exigence,
  ExigenceComparee,
  Referentiel,
  ReferentielSelectionne,
} from '../exigence.type';

export type Comparaison =
  | `COMPARAISON_${Referentiel}_${ReferentielSelectionne}`
  | `COMPARAISON_${ReferentielSelectionne}_${Referentiel}`;
export type ConfigurationTableauComparaison = Record<
  Comparaison,
  | {
      titreColonneSource: string;
      titreColonneCible: string;
      colonneSource: Snippet<[Exigence]>;
      colonneCible: Snippet<[ExigenceComparee[]]>;
    }
  | undefined
>;
