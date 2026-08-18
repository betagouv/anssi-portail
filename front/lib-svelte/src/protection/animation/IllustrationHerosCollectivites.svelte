<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import HerosCollectivites from './HerosCollectivites.svelte';

  const scènes = [HerosCollectivites];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Des agents d'une collectivité en réunion de travail. Protection des données : accompagner les services vers la conformité."
/>
