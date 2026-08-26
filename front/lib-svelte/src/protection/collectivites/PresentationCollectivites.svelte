<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import { onMount } from 'svelte';
  import NavigationTertiaire from '../../navigation/NavigationTertiaire.svelte';
  import { type PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import MotEnExergue from '../../ui/MotEnExergue.svelte';
  import IllustrationHerosCollectivites from '../animation/IllustrationHerosCollectivites.svelte';
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
  onMount(() => {
    const fragmentActuel = window.location.hash;
    const fragmentsAvecEsperluette = liens.map((lien) => `${lien.fragment}&`);
    const fragmentActuelContientEsperluette = fragmentsAvecEsperluette.some((fragment) =>
      fragmentActuel.startsWith(fragment)
    );
    if (fragmentActuelContientEsperluette) {
      // Le commit fbc0aa3f oblige à séparer les segments du fragment via un /, l'esperluette n'est plus supportée
      // Redirection nécessaire pour la gestion de potentiels favoris sur l'ancienne structure d'URL
      window.location.hash = fragmentActuel.replace('&', '/');
    }
  });

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Protéger ma collectivité', fondSombre: true };
</script>

<HerosRiche
  description="Toutes les collectivités sont exposées au risque de cyberattaques. En 2025, elles ont notamment représenté 11&nbsp;% des victimes de rançongiciels ou ransowmare."
  propriétésFilAriane={{ ...propriétésFilAriane, fondSombre: false }}
  variante="vert-clair"
>
  {#snippet titreHtml()}
    Protéger ma <MotEnExergue motif="vague">collectivité</MotEnExergue> contre les cyberattaques
  {/snippet}
  {#snippet illustration()}
    <IllustrationHerosCollectivites />
  {/snippet}
</HerosRiche>

<NavigationTertiaire {liens} centré bind:lienActif />

{#if estServeur}
  <Proteger origine="landing-collectivites" />
  <Solutions {itemsCyber} {guides} />
{:else if lienActif === '#proteger'}
  <Proteger origine="landing-collectivites" />
{:else}
  <Solutions {itemsCyber} />
{/if}
