<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { récupèreArticle, type ArticleAPI } from '../passerelles/blog/articles';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import { Article } from './article.type';
  import EncartParcoursSecurisationArticle from './EncartParcoursSecurisationArticle.svelte';

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
    <p class="date-article texte-mention-xs">{article.publicationOuMiseÀJourFormattée()}</p>

    <article>
      <!-- eslint-disable-next-line svelte/no-at-html-tags-->
      {@html article.contenu}
    </article>
    <EncartParcoursSecurisationArticle />
  </dsfr-container>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille.scss' as *;
  dsfr-container {
    padding-block: 4rem;

    .date-article {
      margin-inline: auto;

      @include a-partir-de(xl) {
        max-width: taille-pour-colonnes(8);
      }
    }

    article {
      margin-inline: auto;

      @include a-partir-de(xl) {
        max-width: taille-pour-colonnes(8);
      }

      :global(img),
      :global(video) {
        width: 100%;
      }

      :global(video) {
        border-radius: 10px;
      }

      :global(.conteneur-video .legende) {
        font-style: italic;
        text-align: center;
        margin: 0;
        padding: 0;
      }

      :global(a) {
        display: inline;
        color: currentColor;
        text-decoration: underline;
        text-underline-offset: 4px;
        text-decoration-thickness: 1px;
        color: var(--text-action-high-blue-france);

        &:hover {
          text-decoration-thickness: 2px;
        }
      }

      :global(ul li) {
        padding-bottom: 8px;
      }
    }
  }
</style>
