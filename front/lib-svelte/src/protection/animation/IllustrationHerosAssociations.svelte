<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import HerosAssociations from './HerosAssociations.svelte';

  const scènes = [HerosAssociations];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Des bénévoles d'une association réunis en cercle. Bon réflexe : protéger les adhérents et les bénévoles."
/>
