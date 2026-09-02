<script lang="ts">
  import IllustrationAnimee from '../accueil/animation/IllustrationAnimee.svelte';
  import SceneHeroMiniTest from './SceneHeroMiniTest.svelte';

  const scènes = [SceneHeroMiniTest];
</script>

<IllustrationAnimee {scènes} étiquette="Un groupe regarde la présentation d'un test de maturité cyber." />
