<script lang="ts">
  import { onMount } from 'svelte';
  import { récupèreRésumésDArticle, type RésuméArticleAPI } from '../passerelles/blog/articles';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';

  let résumés: RésuméArticleAPI[] = $state([]);

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Conseils cyber' };

  onMount(async () => {
    résumés = await récupèreRésumésDArticle();
  });
</script>

<Heros
  description="Tous nos conseils pour renforcer la cybersécurité de votre organisation."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
  theme="clair"
  titre="Conseils cyber"
/>
<dsfr-container>
  <div class="grille">
    {#each résumés as résumé (résumé.slug)}
      <dsfr-card
        actionMarkup="a"
        enlarge="true"
        href={`/conseils-cyber/${résumé.slug}`}
        markup="h3"
        title={résumé.titre}
        size="sm"
      ></dsfr-card>
    {/each}
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .grille {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-top: 4rem;
    padding-bottom: 4.5rem;

    @include a-partir-de(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include a-partir-de(lg) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include a-partir-de(xl) {
      grid-template-columns: repeat(4, 1fr);
    }

    dsfr-card {
      min-height: initial;
    }
  }
</style>
