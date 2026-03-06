import { derived } from 'svelte/store';
import { exigencesStore } from './exigences.store';
import { rechercheParCorrespondance } from './rechercheParCorrespondance';

export const exigencesFiltrees = derived(
  [exigencesStore, rechercheParCorrespondance],
  ([$exigences, $rechercheParCorrespondance]) => ({
    exigences: $exigences.filter(rechercheParCorrespondance.ok),
    filtresActifs: !!$rechercheParCorrespondance,
    reinitialise: () => {
      rechercheParCorrespondance.reinitialise();
    },
  })
);
