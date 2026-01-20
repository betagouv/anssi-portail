<script lang="ts">
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeAnneau from './LegendeAnneau.svelte';
  import type { Serie } from './Serie';

  let serie: Serie = [
    {
      libelle: 'libelle1',
      valeur: 10,
    },
    {
      libelle: 'libelle2',
      valeur: 10,
    },
    {
      libelle: 'libelle3',
      valeur: 10,
    },
  ];
</script>

<div class="">
  <GraphiqueAnneau {serie} nomDeLaDonnee="tests réalisés" />
  <LegendeAnneau {serie} />
</div>
