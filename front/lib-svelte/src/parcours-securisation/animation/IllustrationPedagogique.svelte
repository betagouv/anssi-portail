<script lang="ts">
  import { untrack, type Component } from 'svelte';
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import SectionPedagogique from './SectionPedagogique.svelte';

  let { urlBase = '' }: { urlBase?: string } = $props();

  const scènes: (Component | [Component<any>, Record<string, unknown>])[] = [
    [SectionPedagogique, { urlBase: untrack(() => urlBase) }],
  ];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Une vidéo pédagogique expliquant pourquoi activer la vérification en deux étapes."
/>
