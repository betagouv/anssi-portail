<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import SectionProgression from './SectionProgression.svelte';

  const scènes = [SectionProgression];
</script>

<IllustrationAnimee {scènes} étiquette="Carte de suivi de progression du parcours avec sa barre de complétion." />
