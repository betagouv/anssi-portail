<script lang="ts">
  import { untrack, type Component } from 'svelte';
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';

  import SceneHerosVraiFaux from './SceneHerosVraiFaux.svelte';

  let { urlBase = '' }: { urlBase?: string } = $props();

  const scènes: (Component | [Component<any>, Record<string, unknown>])[] = [
    [SceneHerosVraiFaux, { urlBase: untrack(() => urlBase) }],
  ];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Trois cartes de quiz entourées des réponses Faux et Vrai et de réactions amusées."
/>
