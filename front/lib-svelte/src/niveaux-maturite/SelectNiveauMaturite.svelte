<script lang="ts">
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';
  import { niveauxMaturite } from './NiveauxMaturite.donnees';
  import type { IdNiveau } from './NiveauxMaturite.type';

  type Props = {
    libelle: string;
    idNiveauSelectionne: IdNiveau;
  };
  let { libelle = 'Sélectionner un niveau de maturité', idNiveauSelectionne = $bindable() }: Props = $props();
</script>

<SelecteurSimple
  {libelle}
  options={niveauxMaturite.map((niveau) => ({
    valeur: niveau.id,
    libelle: niveau.label,
  }))}
  bind:valeurSelectionnee={idNiveauSelectionne}
/>
