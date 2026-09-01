<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import CarteTest from './CarteTest.svelte';
  import IllustrationHeroMiniTest from './IllustrationHeroMiniTest.svelte';
  import PlanteAnimee from './PlanteAnimee.svelte';
  import TestVraiFauxAnime from './TestVraiFauxAnime.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Faire le test !',
  };

  const réactionsInitiales = { '❤️': 0, '👍': 0, '🔥': 0 };
  const donnéesInitiales = {
    réactions: {
      MaturiteCyber: réactionsInitiales,
      VraiFaux: réactionsInitiales,
    },
  };
  type DonnéesPage = typeof donnéesInitiales;

  let donnéesPage: DonnéesPage | undefined = $state(undefined);
  onMount(async () => {
    const réponse = await axios.get('/api/reactions-mini-tests');
    donnéesPage = { ...donnéesInitiales, ...réponse.data };
  });
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
    <CarteTest
      cible="MaturiteCyber"
      couleurDeFond="--background-alt-green-bourgeon"
      titre="Quelle est la maturité cyber de votre organisation&nbsp?"
      href="/mini-tests/maturite"
      réactions={donnéesPage?.réactions.MaturiteCyber ?? {}}
    >
      {#snippet image(survol)}
        <PlanteAnimee {survol} />
      {/snippet}
    </CarteTest>
    <CarteTest
      cible="VraiFaux"
      couleurDeFond="--background-alt-pink-macaron"
      titre="Cyberattaques&nbsp: saurez-vous démêler le vrai du faux&nbsp?"
      href="/mini-tests/vrai-faux"
      réactions={donnéesPage?.réactions.VraiFaux ?? {}}
    >
      {#snippet image(survol)}
        <TestVraiFauxAnime {survol} />
      {/snippet}
    </CarteTest>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .cartes {
    gap: 1rem;
    display: grid;
    padding-block: 3rem 4.5rem;

    @include a-partir-de(md) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include a-partir-de(xl) {
      gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
