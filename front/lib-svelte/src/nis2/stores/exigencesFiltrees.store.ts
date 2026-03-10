import { derived } from 'svelte/store';
import { exigencesStore } from './exigences.store';
import { rechercheParCorrespondance } from './rechercheParCorrespondance';
import { rechercheParEntiteNis2 } from './rechercheParEntiteNis2';
import type { ExigenceNis2 } from '../exigence.type';
import { rechercheParObjectifNis2 } from './rechercheParObjectifNis2';
import { rechercheParThematiqueNis2 } from './rechercheParThematiqueNis2';
import { rechercheParNormeISO } from './rechercheParNormeISO';

export const exigencesFiltrees = derived(
  [
    exigencesStore,
    rechercheParCorrespondance,
    rechercheParEntiteNis2,
    rechercheParObjectifNis2,
    rechercheParThematiqueNis2,
    rechercheParNormeISO,
  ],
  ([
    $exigences,
    $rechercheParCorrespondance,
    $rechercheParEntiteNis2,
    $rechercheParObjectifNis2,
    $rechercheParThematiqueNis2,
    $rechercheParNormeISO,
  ]) => ({
    objectifs: [
      ...new Set($exigences.map((e) => (e as ExigenceNis2).objectifSecurite)),
    ]
      .map((objectif) =>
        objectif ? { value: objectif, label: objectif } : null
      )
      .filter(Boolean),
    thematiques: [
      ...new Set($exigences.map((e) => (e as ExigenceNis2).thematique)),
    ]
      .map((thematique) =>
        thematique ? { value: thematique, label: thematique } : null
      )
      .filter(Boolean),
    normesISO: [
      ...new Set(
        $exigences.map((exigence) =>
          'norme' in exigence ? exigence.norme : null
        )
      ),
    ]
      .map((norme) => (norme ? { value: norme, label: norme } : null))
      .filter(Boolean),
    exigences: $exigences.filter(
      (e) =>
        rechercheParCorrespondance.ok(e) &&
        rechercheParEntiteNis2.ok(e as ExigenceNis2) &&
        rechercheParObjectifNis2.ok(e as ExigenceNis2) &&
        rechercheParThematiqueNis2.ok(e as ExigenceNis2) &&
        rechercheParNormeISO.ok(e)
    ),
    filtresActifs:
      !!$rechercheParCorrespondance ||
      !!$rechercheParEntiteNis2 ||
      !!$rechercheParObjectifNis2 ||
      !!$rechercheParThematiqueNis2 ||
      !!$rechercheParNormeISO,
    reinitialise: () => {
      rechercheParCorrespondance.reinitialise();
      rechercheParEntiteNis2.reinitialise();
      rechercheParObjectifNis2.reinitialise();
      rechercheParThematiqueNis2.reinitialise();
      rechercheParNormeISO.reinitialise();
    },
  })
);
