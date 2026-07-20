<script lang="ts">
  import Tuile from '../ui/Tuile.svelte';

  const { mode = 'complet' }: { mode?: 'compact' | 'complet' } = $props();
  const tailleImage = $derived(mode === 'compact' ? '40' : '80');
  const compact = $derived(mode === 'compact');
</script>

<svelte:element this={mode === 'compact' ? 'h4' : 'h2'}
  >Trouvez les interlocuteurs et dispositifs pour vous soutenir dans vos efforts.</svelte:element
>
<lab-anssi-carrousel-tuiles class={mode}>
  <Tuile
    titre="Contacts cyber"
    descriptionTexte="Des contacts cyber de proximité pour vous orienter et répondre à vos questions."
    href="/contacts"
    {compact}
    élargi
  >
    <img
      slot="pictogram"
      src="/assets/images/trois-mains-croisees.svg"
      width={tailleImage}
      height={tailleImage}
      alt="Contacts cyber"
    />
  </Tuile>
  <Tuile
    titre="Prestataires qualifiés et labellisés"
    descriptionTexte="Tous les prestataires de confiance et produits/services qualifiés et labellisés afin de vous accompagner sur vos différents enjeux cyber."
    href="/prestataires-labellises"
    {compact}
    élargi
  >
    <img
      slot="pictogram"
      src="/assets/images/coche-jaune-sur-rond-noir.svg"
      alt="Prestataires qualifiés et labellisés"
    />
  </Tuile>
  <Tuile
    titre="Financements cyber"
    descriptionTexte="Bénéficiez d'accompagnements financés ou de subventions pour renforcer la maturité cyber de votre organisation."
    href="/financements"
    {compact}
    élargi
  >
    <img
      slot="pictogram"
      src="/assets/images/pile-de-pieces.svg"
      width={tailleImage}
      height={tailleImage}
      alt="Financements cyber"
    />
  </Tuile>
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

    :global(dsfr-tile) {
      flex: 1 0 254px;
      scroll-snap-align: center;

      @include a-partir-de(lg) {
        flex: 1 0 241px;
      }
    }
  }
</style>
