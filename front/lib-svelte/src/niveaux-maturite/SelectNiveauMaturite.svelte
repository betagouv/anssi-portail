<script lang="ts">
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';
  import { niveauxMaturite } from './NiveauxMaturite.donnees';
  import type { IdNiveau } from './NiveauxMaturite.type';

  type Props = {
    id?: string;
    libelle: string;
    idNiveauSelectionne: IdNiveau;
  };
  let {
    id = undefined,
    libelle = 'Sélectionner un niveau de maturité',
    idNiveauSelectionne = $bindable(),
  }: Props = $props();
</script>

<SelecteurSimple
  {id}
  {libelle}
  options={niveauxMaturite.map((niveau) => ({
    valeur: niveau.id,
    libelle: niveau.label,
  }))}
  bind:valeurSelectionnee={idNiveauSelectionne}
/>
