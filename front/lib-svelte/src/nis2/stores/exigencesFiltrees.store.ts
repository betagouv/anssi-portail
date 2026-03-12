import { derived } from 'svelte/store';
import { exigencesStore } from './exigences.store';
import { rechercheParCorrespondance } from './rechercheParCorrespondance';
import { rechercheParEntiteNis2 } from './rechercheParEntiteNis2';
import type { Exigence } from '../exigence.type';
import { rechercheParObjectifNis2 } from './rechercheParObjectifNis2';
import { rechercheParThematiqueNis2 } from './rechercheParThematiqueNis2';
import { rechercheParNormeISO } from './rechercheParNormeISO';
import { rechercheParFonctionCyFun23 } from './rechercheParFonctionCyFun23';

const extraisLesOptions = (exigences: Exigence[]) => {
  const groupeDeFiltre = exigences.reduce(
    (accumulateur, e) => {
      if ('objectifSecurite' in e && e.objectifSecurite) {
        accumulateur.objectifs.add(e.objectifSecurite);
      }
      if ('thematique' in e && e.thematique) {
        accumulateur.thematiques.add(e.thematique);
      }
      if ('norme' in e && e.norme) {
        accumulateur.normesISO.add(e.norme);
      }
      return accumulateur;
    },
    {
      objectifs: new Set<string>(),
      thematiques: new Set<string>(),
      normesISO: new Set<string>(),
    }
  );
  const creeUneOption = (valeur: string): { label: string; value: string } => ({
    label: valeur,
    value: valeur,
  });
  return {
    objectifs: [...groupeDeFiltre.objectifs].map(creeUneOption),
    thematiques: [...groupeDeFiltre.thematiques].sort().map(creeUneOption),
    normesISO: [...groupeDeFiltre.normesISO].sort().map(creeUneOption),
  };
};

export const exigencesFiltrees = derived(
  [
    exigencesStore,
    rechercheParCorrespondance,
    rechercheParEntiteNis2,
    rechercheParObjectifNis2,
    rechercheParThematiqueNis2,
    rechercheParNormeISO,
    rechercheParFonctionCyFun23,
  ],
  ([
    $exigences,
    $rechercheParCorrespondance,
    $rechercheParEntiteNis2,
    $rechercheParObjectifNis2,
    $rechercheParThematiqueNis2,
    $rechercheParNormeISO,
    $rechercheParFonctionCyFun23,
  ]) => ({
    ...extraisLesOptions($exigences),
    exigences: $exigences.filter(
      (e) =>
        rechercheParCorrespondance.ok(e) &&
        rechercheParEntiteNis2.ok(e) &&
        rechercheParObjectifNis2.ok(e) &&
        rechercheParThematiqueNis2.ok(e) &&
        rechercheParNormeISO.ok(e) &&
        rechercheParFonctionCyFun23.ok(e)
    ),
    filtresActifs:
      !!$rechercheParCorrespondance ||
      !!$rechercheParEntiteNis2 ||
      !!$rechercheParObjectifNis2 ||
      !!$rechercheParThematiqueNis2 ||
      !!$rechercheParNormeISO ||
      !!$rechercheParFonctionCyFun23,
    reinitialise: () => {
      rechercheParCorrespondance.reinitialise();
      rechercheParEntiteNis2.reinitialise();
      rechercheParObjectifNis2.reinitialise();
      rechercheParThematiqueNis2.reinitialise();
      rechercheParNormeISO.reinitialise();
      rechercheParFonctionCyFun23.reinitialise();
    },
  })
);
