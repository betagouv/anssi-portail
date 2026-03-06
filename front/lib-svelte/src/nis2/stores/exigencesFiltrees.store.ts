import { derived } from 'svelte/store';
import { exigencesStore } from './exigences.store';
import { rechercheParCorrespondance } from './rechercheParCorrespondance';

export const exigencesFiltrees = derived(
  [exigencesStore, rechercheParCorrespondance],
  ([$exigences]) => {
    return $exigences.filter(rechercheParCorrespondance.ok);
  }
);
