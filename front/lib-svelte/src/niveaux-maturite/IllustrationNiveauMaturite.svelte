<script lang="ts">
  import type { NiveauMaturite } from './NiveauxMaturite.type';

  export let niveauSelectionne: NiveauMaturite;
</script>

<div class="illustration">
  <img
    src="/assets/images/test-maturite/niveaux/{niveauSelectionne.id}.svg"
    alt={`Illustration niveau ${niveauSelectionne.label}`}
  />
</div>
