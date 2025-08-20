import { derived } from 'svelte/store';
import { financementsStore } from './financements.store';
import { rechercheParRegion } from './rechercheParRegion.store';
import { rechercheParTypeFinancement } from './rechercheParTypeFinancement.store';
import { rechercheParTypeOrganisation } from './rechercheParTypeOrganisation.store';

export const financementsFiltre = derived(
  [
    financementsStore,
    rechercheParRegion,
    rechercheParTypeFinancement,
    rechercheParTypeOrganisation,
  ],
  ([$financementsStore]) => {
    const resultat = $financementsStore.filter(
      (f) =>
        rechercheParRegion.ok(f) &&
        rechercheParTypeFinancement.ok(f) &&
        rechercheParTypeOrganisation.ok(f)
    );
    
    const typesFinancement = [
      ...new Set($financementsStore.map((t) => t.typesDeFinancement).flat()),
    ].sort();

    const typesOrganisation = [
      ...new Set($financementsStore.map((t) => t.entitesElligibles).flat()),
    ].sort((a, b) => b.localeCompare(a));

    return { resultat, typesFinancement, typesOrganisation };
  }
);
