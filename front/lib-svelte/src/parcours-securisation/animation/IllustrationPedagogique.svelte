<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import SectionPedagogique from './SectionPedagogique.svelte';

  const scènes = [SectionPedagogique];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Une vidéo pédagogique expliquant pourquoi activer la vérification en deux étapes."
/>
