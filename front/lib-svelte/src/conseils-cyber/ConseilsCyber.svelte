<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import type { RésuméArticleAPI } from '../passerelles/blog/articles';
  import Article from './Article.svelte';
  import ListeArticles from './ListeArticles.svelte';

  type Props = {
    articlePréchargé?: RésuméArticleAPI;
    résumésPréchargés?: RésuméArticleAPI[];
  };

  const { articlePréchargé, résumésPréchargés }: Props = $props();

  const slugArticle = estServeur ? undefined : window.location.pathname.match(/\/conseils-cyber\/(.*)/)?.[1];
</script>

{#if slugArticle || articlePréchargé}
  <Article {articlePréchargé} {slugArticle} />
{:else}
  <ListeArticles {résumésPréchargés} />
{/if}
