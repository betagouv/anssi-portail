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
  import { profilStore } from '../stores/profil.store';
  import RadarMenaceAnime from './RadarMenaceAnime.svelte';

  const estConnecté = $derived(!!$profilStore);

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Faire le test !',
  };

  const réactionsInitiales = { '❤️': 0, '👍': 0, '🔥': 0 };
  const donnéesInitiales = {
    compteurs: {
      MaturiteCyber: 0,
      VraiFaux: 0,
    },
    réactions: {
      MaturiteCyber: réactionsInitiales,
      VraiFaux: réactionsInitiales,
      Exposition: réactionsInitiales,
    },
  };
  type DonnéesPage = typeof donnéesInitiales;

  let donnéesPage: DonnéesPage = $state(donnéesInitiales);

  onMount(async () => {
    const réponse = await axios.get('/api/info-mini-tests');
    donnéesPage = { ...donnéesInitiales, ...réponse.data };
  });

  const seuil = 1000;
  const arrondis = (valeur: number) => Math.round(valeur / 100) * 100;
  const compteursArrondis = $derived({
    MaturitéCyber: donnéesPage.compteurs.MaturiteCyber > seuil ? arrondis(donnéesPage.compteurs.MaturiteCyber) : 0,
    VraiFaux: donnéesPage.compteurs.VraiFaux > seuil ? arrondis(donnéesPage.compteurs.VraiFaux) : 0,
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
        href={estConnecté ? '/ma-maturite' : '/test-maturite'}
        réactions={donnéesPage?.réactions.MaturiteCyber ?? {}}
        badge={{
          libellé: compteursArrondis.MaturitéCyber ? `+${compteursArrondis.MaturitéCyber} tests réalisés` : undefined,
          accent: 'pink-macaron',
        }}
        estimationEnMinutes={5}
      >
        {#snippet image(survol)}
          <PlanteAnimee {survol} />
        {/snippet}
      </CarteTest>
      <CarteTest
        cible="VraiFaux"
        couleurDeFond="--background-alt-pink-macaron"
        titre="Cyberattaques&nbsp: saurez-vous démêler le vrai du faux&nbsp?"
        href="/vrai-faux"
        réactions={donnéesPage?.réactions.VraiFaux ?? {}}
        badge={{
          libellé: compteursArrondis.VraiFaux ? `+${compteursArrondis.VraiFaux} tests réalisés` : undefined,
          accent: 'purple-glycine',
        }}
        estimationEnMinutes={3}
      >
        {#snippet image(survol)}
          <TestVraiFauxAnime {survol} />
        {/snippet}
      </CarteTest>
      <CarteTest
        cible="Exposition"
        couleurDeFond="--background-alt-blue-ecume"
        titre="Quels types de cyberattaques peuvent cibler mon organisation&nbsp;?"
        href="/exposition"
        réactions={donnéesPage?.réactions.Exposition ?? {}}
        badge={{
          libellé: compteursArrondis.VraiFaux ? `+${compteursArrondis.VraiFaux} tests réalisés` : undefined,
          accent: 'purple-glycine',
        }}
        estimationEnMinutes={5}
      >
        {#snippet image(survol)}
          <RadarMenaceAnime {survol} />
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
