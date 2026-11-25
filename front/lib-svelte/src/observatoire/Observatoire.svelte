<script lang="ts">
  import { onMount } from 'svelte';
  import '../graphiques/dsfrChart';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import { récupèreDonnéesObservatoire, type DonnéesObservatoire } from '../passerelles/observatoire';
  import OngletMenaceCyber from './OngletMenaceCyber.svelte';
  import OngletOrganisations from './OngletOrganisations.svelte';
  import OngletProjets from './OngletProjets.svelte';

  const onglets = [
    { label: 'Menace cyber', fragment: '#menace-cyber' },
    { label: 'Organisations', fragment: '#organisations' },
    { label: 'Projets', fragment: '#projets' },
  ];
  let ongletActif = $state('#menace-cyber');

  let données: DonnéesObservatoire | undefined = $state();
  let enErreur = $state(false);

  onMount(async () => {
    try {
      données = await récupèreDonnéesObservatoire();
    } catch {
      enErreur = true;
    }
  });
</script>

<header class="bandeau">
  <dsfr-container>
    <h1>Observatoire de la cybersécurité des organisations</h1>
    <p class="chapo">La menace, la maturité et l’engagement des organisations françaises dans leur sécurisation.</p>
    <p class="mention">
      Les données sont issues des usages de MesServicesCyber, de MonServiceSécurisé et du Panorama de la menace 2025.
    </p>
  </dsfr-container>
</header>

<div class="contenu">
  <dsfr-container>
    <NavigationTertiaire liens={onglets} bind:lienActif={ongletActif} />

    {#if ongletActif === '#menace-cyber'}
      <OngletMenaceCyber données={données?.menaceCyber} {enErreur} />
    {:else if ongletActif === '#organisations'}
      <OngletOrganisations données={données?.organisations} {enErreur} />
    {:else if ongletActif === '#projets'}
      <OngletProjets données={données?.projets} {enErreur} />
    {/if}
  </dsfr-container>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  p {
    margin: 0;
  }

  .bandeau {
    padding: 3rem 0 2.5rem;
    border-bottom: 1px solid var(--border-default-grey);

    h1 {
      color: var(--text-title-grey);
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.75rem;

      @include a-partir-de(md) {
        font-size: 2.5rem;
        line-height: 3rem;
      }
    }

    .chapo {
      color: var(--text-default-grey);
      font-size: 1.25rem;
      line-height: 2rem;
      margin-bottom: 0.75rem;
    }

    .mention {
      color: var(--text-default-grey);
      font-size: 0.875rem;
      line-height: 1.5rem;
    }
  }

  .contenu {
    padding: 2rem 0 5rem;
    background: var(--background-alt-grey);
  }
</style>
