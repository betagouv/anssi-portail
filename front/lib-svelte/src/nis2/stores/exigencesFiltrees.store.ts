import { derived } from 'svelte/store';
import { exigencesStore } from './exigences.store';
import { rechercheParCorrespondance } from './rechercheParCorrespondance';
import { rechercheParEntiteNis2 } from './rechercheParEntiteNis2';
import type { ExigenceNis2 } from '../exigence.type';
import { rechercheParObjectifNis2 } from './rechercheParObjectifNis2';

export const exigencesFiltrees = derived(
  [
    exigencesStore,
    rechercheParCorrespondance,
    rechercheParEntiteNis2,
    rechercheParObjectifNis2,
  ],
  ([
    $exigences,
    $rechercheParCorrespondance,
    $rechercheParEntiteNis2,
    $rechercheParObjectifNis2,
  ]) => ({
    objectifs: [
      ...new Set($exigences.map((e) => (e as ExigenceNis2).objectifSecurite)),
    ]
      .map((objectif) =>
        objectif ? { value: objectif, label: objectif } : null
      )
      .filter(Boolean),
    exigences: $exigences.filter(
      (e) =>
        rechercheParCorrespondance.ok(e) &&
        rechercheParEntiteNis2.ok(e as ExigenceNis2) &&
        rechercheParObjectifNis2.ok(e as ExigenceNis2)
    ),
    filtresActifs:
      !!$rechercheParCorrespondance ||
      !!$rechercheParEntiteNis2 ||
      !!$rechercheParObjectifNis2,
    reinitialise: () => {
      rechercheParCorrespondance.reinitialise();
      rechercheParEntiteNis2.reinitialise();
      rechercheParObjectifNis2.reinitialise();
    },
  })
);
