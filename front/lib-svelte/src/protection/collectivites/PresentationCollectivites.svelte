<script lang="ts">
  import { afficheNouvelleDA, estServeur } from '$plateforme/environnement';
  import NavigationTertiaire from '../../navigation/NavigationTertiaire.svelte';
  import Alternatives from '../../ui/Alternatives.svelte';
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane, { type Props as PropriétésFilAriane } from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import Proteger from '../Proteger.svelte';
  import Solutions from './Solutions.svelte';

  let { itemsCyber, guides = [] } = $props();

  const liens = [
    {
      label: 'Protéger ma collectivité',
      fragment: '#proteger',
    },
    {
      label: 'Toutes les solutions pour m’aider',
      fragment: '#solutions',
    },
  ];
  let lienActif = $state('#proteger');

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Protéger ma collectivité', fondSombre: true };
</script>

<Alternatives affichageAlternatif={afficheNouvelleDA}>
  {#snippet défaut()}
    <Heros
      format="heros"
      theme="sombre"
      cacheTags
      titre="Protéger ma collectivité contre les cyberattaques"
      description="Toutes les collectivités sont exposées au risque de cyberattaques. En 2025, elles ont notamment représenté 11&nbsp;% des victimes de rançongiciels ou ransowmare."
      cacheActions
      illustrationSource="/assets/images/personne-qui-cogite.svg"
      illustrationAlt=""
      cacheIllustration={false}
      segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
    >
      {#snippet filAriane()}
        <FilAriane {...propriétésFilAriane} />
      {/snippet}
    </Heros>
  {/snippet}
  {#snippet alternatif()}
    <HerosRiche
      description="Toutes les collectivités sont exposées au risque de cyberattaques. En 2025, elles ont notamment représenté 11&nbsp;% des victimes de rançongiciels ou ransowmare."
      propriétésFilAriane={{ ...propriétésFilAriane, fondSombre: false }}
      variante="vert-clair"
    >
      {#snippet titreHtml()}
        Protéger ma <span class="mot-souligne"><span>collectivité</span></span> contre les cyberattaques
      {/snippet}
      {#snippet illustration()}
        <img src="/assets/images/personne-qui-cogite.svg" alt="" />
      {/snippet}
    </HerosRiche>
  {/snippet}
</Alternatives>

<NavigationTertiaire {liens} bind:lienActif />

{#if estServeur}
  <Proteger origine="landing-collectivites" />
  <Solutions {itemsCyber} {guides} />
{:else if lienActif === '#proteger'}
  <Proteger origine="landing-collectivites" />
{:else}
  <Solutions {itemsCyber} />
{/if}

<style lang="scss">
  img {
    width: 100%;
  }

  .mot-souligne {
    position: relative;
    white-space: nowrap;

    span {
      position: relative;
      z-index: 2;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 31px;
      pointer-events: none;
      background: {
        image: url('/assets/images/motif-mot-souligne-vague-moutarde.svg');
        repeat: no-repeat;
        position: center;
        size: contain;
      }
    }
  }
</style>
