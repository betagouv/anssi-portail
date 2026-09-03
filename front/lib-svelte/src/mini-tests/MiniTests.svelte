<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import BoutonsPartagePage from '../test-maturite/BoutonsPartagePage.svelte';
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import CarteTest from './CarteTest.svelte';
  import IllustrationHeroMiniTest from './IllustrationHeroMiniTest.svelte';
  import PlanteAnimee from './PlanteAnimee.svelte';
  import TestVraiFauxAnime from './TestVraiFauxAnime.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Faire le test !',
  };

  const seuil = 1000;

  const réactionsInitiales = { '❤️': 0, '👍': 0, '🔥': 0 };
  const donnéesInitiales = {
    compteurs: {
      MaturiteCyber: 0,
      VraiFaux: 0,
    },
    réactions: {
      MaturiteCyber: réactionsInitiales,
      VraiFaux: réactionsInitiales,
    },
  };
  type DonnéesPage = typeof donnéesInitiales;

  const formateur = Intl.NumberFormat('fr', { notation: 'compact', compactDisplay: 'short' });

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
  <div class="contenu-section">
    <div class="cartes">
      <CarteTest
        cible="MaturiteCyber"
        couleurDeFond="--background-alt-green-bourgeon"
        titre="Quelle est la maturité cyber de votre organisation&nbsp?"
        href="/test-maturite"
        réactions={donnéesPage?.réactions.MaturiteCyber ?? {}}
        badge={{
          libellé:
            (donnéesPage?.compteurs.MaturiteCyber ?? 0) > seuil
              ? `+${formateur.format((donnéesPage?.compteurs.MaturiteCyber ?? 0) - 500)} tests réalisés`
              : undefined,
          accent: 'pink-macaron',
        }}
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
        badge={{
          libellé:
            (donnéesPage?.compteurs.VraiFaux ?? 0) > seuil
              ? `+${formateur.format((donnéesPage?.compteurs.VraiFaux ?? 0) - 500)} quiz réalisés`
              : undefined,
          accent: 'purple-glycine',
        }}
      >
        {#snippet image(survol)}
          <TestVraiFauxAnime {survol} />
        {/snippet}
      </CarteTest>
    </div>
    <BoutonsPartagePage cheminPartagé="/faire-le-test" sujetMail="Tests gratuits pour maîtriser les risques cyber" />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .contenu-section {
    padding-block: 3rem 4.5rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    .cartes {
      gap: 1rem;
      display: grid;

      @include a-partir-de(md) {
        grid-template-columns: repeat(2, 1fr);
      }
      @include a-partir-de(xl) {
        gap: 1.5rem;
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
</style>
