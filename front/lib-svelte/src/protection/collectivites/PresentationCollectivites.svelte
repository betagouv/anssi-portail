<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import NavigationTertiaire from '../../navigation/NavigationTertiaire.svelte';
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane, { type Props as PropriétésFilAriane } from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
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

<NavigationTertiaire {liens} bind:lienActif />

{#if estServeur}
  <Proteger origine="landing-collectivites" />
  <Solutions {itemsCyber} {guides} />
{:else if lienActif === '#proteger'}
  <Proteger origine="landing-collectivites" />
{:else}
  <Solutions {itemsCyber} />
{/if}
