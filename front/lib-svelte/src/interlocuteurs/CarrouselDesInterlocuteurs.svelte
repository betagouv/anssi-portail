<script lang="ts">
  const { mode = 'complet' }: { mode?: 'compact' | 'complet' } = $props();
  const tailleImage = $derived(mode === 'compact' ? '40' : '80');
</script>

<svelte:element this={mode === 'compact' ? 'h4' : 'h2'}
  >Trouvez les interlocuteurs et dispositifs pour vous soutenir dans vos efforts.</svelte:element
>
<lab-anssi-carrousel-tuiles class={mode}>
  <dsfr-tile
    title="Contacts cyber"
    has-description={mode === 'compact' ? undefined : 'true'}
    description="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
    href="/contacts"
    enlarge="true"
    horizontal={mode === 'compact' ? 'true' : undefined}
    size={mode === 'compact' ? 'sm' : 'md'}
  >
    <img
      slot="pictogram"
      src="/assets/images/trois-mains-croisees.svg"
      width={tailleImage}
      height={tailleImage}
      alt="Contacts cyber"
    />
  </dsfr-tile>
  <dsfr-tile
    title="Prestataires qualifiés et labellisés"
    has-description={mode === 'compact' ? undefined : 'true'}
    description="Tous les prestataires de confiance et produits/services qualifiés et labellisés afin de vous accompagner sur vos différents enjeux cyber."
    href="/prestataires-labellises"
    enlarge="true"
    horizontal={mode === 'compact' ? 'true' : undefined}
    size={mode === 'compact' ? 'sm' : 'md'}
  >
    <img
      slot="pictogram"
      src="/assets/images/coche-jaune-sur-rond-noir.svg"
      alt="Prestataires qualifiés et labellisés"
    />
  </dsfr-tile>
  <dsfr-tile
    title="Financements cyber"
    has-description={mode === 'compact' ? undefined : 'true'}
    description="Bénéficiez d'accompagnements financés ou de subventions pour renforcer la maturité cyber de votre organisation."
    href="/financements"
    enlarge="true"
    horizontal={mode === 'compact' ? 'true' : undefined}
    size={mode === 'compact' ? 'sm' : 'md'}
  >
    <img
      slot="pictogram"
      src="/assets/images/pile-de-pieces.svg"
      width={tailleImage}
      height={tailleImage}
      alt="Financements cyber"
    />
  </dsfr-tile>
</lab-anssi-carrousel-tuiles>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  h2 {
    text-align: center;
    margin-bottom: 48px;
    margin-inline: auto;
    @include a-partir-de(lg) {
      max-width: 66%;
    }
  }

  h4 {
    margin-bottom: 2rem;
  }

  lab-anssi-carrousel-tuiles {
    margin-top: 24px;
    min-width: 794px;

    &.compact {
      img {
        width: 40px;
        height: 40px;
      }
    }

    &.complet {
      img {
        width: 80px;
        height: 80px;
      }
    }

    dsfr-tile {
      flex: 1 0 254px;
      scroll-snap-align: center;
      @include a-partir-de(lg) {
        flex: 1 0 241px;
      }
    }
  }
</style>
