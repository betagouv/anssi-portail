import { derived } from 'svelte/store';
import { exigencesStore } from './exigences.store';
import { rechercheParCorrespondance } from './rechercheParCorrespondance';
import { rechercheParEntiteNis2 } from './rechercheParEntiteNis2';
import type { ExigenceNis2 } from '../exigence.type';

export const exigencesFiltrees = derived(
  [exigencesStore, rechercheParCorrespondance, rechercheParEntiteNis2],
  ([$exigences, $rechercheParCorrespondance, $rechercheParEntiteNis2]) => ({
    exigences: $exigences.filter(
      (e) =>
        rechercheParCorrespondance.ok(e) &&
        rechercheParEntiteNis2.ok(e as ExigenceNis2)
    ),
    filtresActifs: !!$rechercheParCorrespondance || !!$rechercheParEntiteNis2,
    reinitialise: () => {
      rechercheParCorrespondance.reinitialise();
      rechercheParEntiteNis2.reinitialise();
    },
  })
);
