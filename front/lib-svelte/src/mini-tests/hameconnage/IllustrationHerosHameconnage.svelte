<script lang="ts">
  import { untrack, type Component } from 'svelte';
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import SceneHerosHameconnage from './SceneHerosHameconnage.svelte';

  let { urlBase = '' }: { urlBase?: string } = $props();

  const scènes: (Component | [Component<any>, Record<string, unknown>])[] = [
    [SceneHerosHameconnage, { urlBase: untrack(() => urlBase) }],
  ];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Trois courriels empilés, entourés d'une alerte, d'une confirmation de courriel vérifié et de réactions : un poisson, une canne à pêche et un visage surpris."
/>
