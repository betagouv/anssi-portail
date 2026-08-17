<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import SectionTuto from './SectionTuto.svelte';

  const scènes = [SectionTuto];
</script>

<IllustrationAnimee {scènes} étiquette="Un tutoriel pas à pas pour activer la vérification en deux étapes." />
