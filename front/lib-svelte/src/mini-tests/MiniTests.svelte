<script lang="ts">
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import Reactions from '../ui/Reactions.svelte';
  import IllustrationHeroMiniTest from './IllustrationHeroMiniTest.svelte';
  import TestVraiFauxAnime from './TestVraiFauxAnime.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Faire le test !',
  };
  let survol = $state(false);
  let réactions = $state({ '❤️': 0, '👍': 0, '🔥': 0 });
</script>

<HerosRiche
  {propriétésFilAriane}
  description="Évaluez votre situation et comprenez mieux les enjeux cyber de votre organisation, simplement et rapidement."
  variante="cafe-creme"
  class="avec-image-fond"
>
  {#snippet titreHtml()}
    Des tests gratuits pour mieux maîtriser les risques cyber
  {/snippet}
  {#snippet illustration()}
    <IllustrationHeroMiniTest />
  {/snippet}
</HerosRiche>

<dsfr-container>
  <div class="cartes">
    <div class="carte">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <dsfr-card
        actionMarkup="a"
        data-cible="VraiFaux"
        data-source="MiniTest"
        enlarge
        hasDescription={false}
        href="/mini-tests/vrai-faux"
        markup="h3"
        size="sm"
        title="Cyberattaques : saurez-vous démêler le vrai du faux ?"
        onmouseenter={() => (survol = true)}
        onmouseleave={() => (survol = false)}
      >
        <div slot="image" class="image">
          <TestVraiFauxAnime {survol} />
        </div>
        <div slot="seo">
          <h3>
            <a href="/mini-tests/vrai-faux">Cyberattaques : saurez-vous démêler le vrai du faux ?</a>
          </h3>
        </div>
      </dsfr-card>
      <Reactions
        bind:réactions
        clé="évaluation-vrai-faux"
        urlDePost="/api/reactions"
        variant="tertiaire-sans-bordure"
      />
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .cartes {
    padding-block: 3rem 4.5rem;
    display: grid;

    @include a-partir-de(md) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include a-partir-de(xl) {
      grid-template-columns: repeat(3, 1fr);
    }

    .carte {
      border: 1px solid var(--border-default-grey);
      display: grid;

      dsfr-card {
        --background-default-grey: var(--background-alt-pink-macaron);
        --background-default-grey-hover: var(--background-alt-pink-macaron-hover);
        margin: -1px;

        .image {
          display: grid;
          place-items: center;
          aspect-ratio: 16/9;
        }
      }
    }
  }
</style>
