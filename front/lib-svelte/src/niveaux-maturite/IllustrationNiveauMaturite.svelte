<script lang="ts">
  import type { NiveauMaturite } from './NiveauxMaturite.type';

  interface Props {
    niveauSelectionne: NiveauMaturite;
  }

  let { niveauSelectionne }: Props = $props();
</script>

<div class="illustration">
  <img
    src="/assets/images/test-maturite/niveaux/{niveauSelectionne.id}.svg"
    alt={`Illustration niveau ${niveauSelectionne.label}`}
  />
</div>
