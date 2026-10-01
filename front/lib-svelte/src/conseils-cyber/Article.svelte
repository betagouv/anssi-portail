<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { récupèreArticle, type ArticleAPI } from '../passerelles/blog/articles';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import { Article } from './article.type';

  type Props = {
    articlePréchargé?: ArticleAPI;
    slugArticle?: string;
  };

  const { articlePréchargé, slugArticle }: Props = $props();

  let article: Article | undefined = $state(
    untrack(() => (articlePréchargé ? new Article(articlePréchargé) : undefined))
  );

  const propriétésFilAriane: PropriétésFilAriane = $derived([
    { nom: 'Conseils cyber', lien: '/conseils-cyber' },
    { nom: article ? article.titre : '' },
  ]);

  onMount(async () => {
    if (slugArticle) {
      const articleApi = await récupèreArticle(slugArticle);
      article = articleApi ? new Article(articleApi) : undefined;
    }
  });
</script>

{#if article}
  <Heros
    description={article.description}
    format="banniere"
    segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
    theme="clair"
    titre={article.titre}
  />
  <dsfr-container>
    <p class="texte-mention-xs">{article.publicationOuMiseÀJourFormattée()}</p>

    <article>
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      {@html article.contenu}
    </article>
  </dsfr-container>
{/if}

<style lang="scss">
  dsfr-container {
    padding-block: 4rem;
  }
</style>
