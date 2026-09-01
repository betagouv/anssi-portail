<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';

  import SceneHerosVraiFaux from './SceneHerosVraiFaux.svelte';

  const scènes = [SceneHerosVraiFaux];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Trois cartes de quiz entourées des réponses Faux et Vrai et de réactions amusées."
/>
