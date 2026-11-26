<script lang="ts">
  import { estServeur } from '@plateforme/environnement';
  import ComposantArticle from '@article/Article.svelte';
  import { Article } from '@article/article.type';
  import type { RésuméArticleAPI } from '@passerelles/blog/articles';
  import ListeArticles from './ListeArticles.svelte';

  type Props = {
    articlePréchargé?: ConstructorParameters<typeof Article>[0];
    résumésPréchargés?: RésuméArticleAPI[];
  };

  const { articlePréchargé, résumésPréchargés }: Props = $props();
  const article = $derived(articlePréchargé ? new Article(articlePréchargé) : undefined);

  const slugArticle = estServeur ? undefined : window.location.pathname.match(/\/conseils-cyber\/(.*)/)?.[1];
</script>

{#if slugArticle || article}
  <ComposantArticle
    articlePréchargé={article}
    {slugArticle}
    masqueTableDesMatières={true}
    parentFilAriane={{ nom: 'Conseils cyber', lien: '/conseils-cyber' }}
  />
{:else}
  <ListeArticles {résumésPréchargés} />
{/if}
