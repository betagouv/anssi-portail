<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { récupèreArticle, type ArticleAPI } from '../passerelles/blog/articles';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';

  type Props = {
    articlePréchargé?: ArticleAPI;
    slugArticle?: string;
  };

  const { articlePréchargé, slugArticle }: Props = $props();

  let article: ArticleAPI | undefined = $state(untrack(() => articlePréchargé));

  const propriétésFilAriane: PropriétésFilAriane = $derived([
    { nom: 'Conseils cyber', lien: '/conseils-cyber' },
    { nom: article ? article.titre : '' },
  ]);

  onMount(async () => {
    if (slugArticle) {
      article = await récupèreArticle(slugArticle);
    }
  });
</script>

{#if article}
  <Heros
    description=""
    format="banniere"
    segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
    theme="clair"
    titre={article.titre}
  />

  <lab-anssi-page-crisp tableDesMatieres={[]} contenu={article.titre}>
    <article slot="seo">
      <div class="contenu">
        <!-- eslint-disable-next-line svelte/no-at-html-tags-->
        {@html article.titre}
      </div>
    </article>
  </lab-anssi-page-crisp>
{/if}
