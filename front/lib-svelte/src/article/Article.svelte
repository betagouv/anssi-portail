<script lang="ts">
  import { PageCrisp } from '@lab-anssi/ui-kit';
  import { onMount, untrack } from 'svelte';
  import { estServeur } from '$plateforme/environnement';
  import { récupèreArticle } from '../passerelles/blog/articles';
  import BoutonsPartagePage from '../test-maturite/BoutonsPartagePage.svelte';
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import RetourUtilisateurSurContenu from '../ui/RetourUtilisateurSurContenu.svelte';
  import { Article } from './article.type';
  import EncartParcoursSecurisationArticle from './EncartParcoursSecurisationArticle.svelte';

  type Props = {
    articlePréchargé?: Article;
    masqueTableDesMatières?: boolean;
    parentFilAriane?: NonNullable<PropriétésFilAriane['parents']>[number];
    slugArticle?: string;
  };

  const { articlePréchargé, slugArticle, masqueTableDesMatières = false, parentFilAriane }: Props = $props();

  let article: Article | undefined = $state(untrack(() => articlePréchargé ?? undefined));

  const propriétésFilAriane: PropriétésFilAriane = $derived({
    parents: parentFilAriane ? [parentFilAriane] : [],
    feuille: article ? article.titre : '',
  });

  onMount(async () => {
    if (slugArticle) {
      article = await récupèreArticle(slugArticle);
    }
  });

  let tableDesMatières = $derived(
    articlePréchargé ? articlePréchargé.tableDesMatières.filter((e) => e.profondeur === 2) : []
  );
</script>

{#if article}
  <Heros
    description={article.description}
    format="banniere"
    {propriétésFilAriane}
    theme="clair"
    titre={article.titre}
  />

  {#if masqueTableDesMatières}
    <dsfr-container class="contenu">
      <p class="date-article texte-mention-xs">{article.publicationOuMiseÀJourFormattée()}</p>

      <article>
        <!-- eslint-disable-next-line svelte/no-at-html-tags-->
        {@html article.contenu}
      </article>
      <EncartParcoursSecurisationArticle />
    </dsfr-container>
    {#if slugArticle}
      <dsfr-container class="partage">
        <div class="contenu-partage">
          <div class="retour">
            <RetourUtilisateurSurContenu identifiantCible={slugArticle} typeDeRetour="article">
              <p class="texte-article-lg">Cet article vous a-t-il aidé&#8239;?</p>
            </RetourUtilisateurSurContenu>
          </div>
          <BoutonsPartagePage cheminPartagé={`/conseils-cyber/${slugArticle}`} sujetMail={article.titre} />
        </div>
      </dsfr-container>
    {/if}
  {:else}
    {#if estServeur}
      <article class="contenu fr-container fr-py-6w">
        <div class="contenu">
          <!-- eslint-disable-next-line svelte/no-at-html-tags-->
          {@html article.contenu}
        </div>
      </article>
    {:else}
      <PageCrisp tableDesMatieres={tableDesMatières} contenu={article.contenu} />
    {/if}
  {/if}
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille.scss' as *;
  .contenu {
    padding-block: 3rem;

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

  .partage {
    background-color: var(--background-alt-blue-france);
    padding: 2rem 0;

    .contenu-partage {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      @include a-partir-de(md) {
        flex-direction: row;
      }

      .retour {
        flex: 1;

        .texte-article-lg {
          font-weight: bold;
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>
