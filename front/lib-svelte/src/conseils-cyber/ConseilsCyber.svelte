<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import type { RésuméArticleAPI } from '../passerelles/blog/articles';
  import ListeArticles from './ListeArticles.svelte';

  type Props = {
    résuméPréchargé?: RésuméArticleAPI;
    résumésPréchargés?: RésuméArticleAPI[];
  };

  const { résuméPréchargé, résumésPréchargés }: Props = $props();

  const slugArticle = estServeur ? undefined : Number(new URL(window.location.href).pathname.split('/').pop());
</script>

{#if slugArticle || résuméPréchargé}
  {résuméPréchargé}
{:else}
  <ListeArticles {résumésPréchargés} />
{/if}
