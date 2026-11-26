<script lang="ts">
  import { DsfrCard } from '@lab-anssi/ui-kit';

  import { détecteRendu } from '@utils/rendu.svelte';

  const rendu = détecteRendu();
  const estBureau = $derived(rendu.estBureau);
</script>

<div>
  <h2 class="fr-h6">Autres ressources</h2>
  <div class="cartes">
    <DsfrCard
      horizontal={estBureau}
      title="Guides et ressources"
      hasDescription
      description="Retrouvez l’ensemble des guides de l’ANSSI et les services et les ressources adaptés à vos besoins."
      href="/catalogue"
      enlarge
    >
      <div slot="image" class="image-carte guides-ressources">
        <img src="/assets/images/guides-et-ressources.avif" alt="" />
      </div>
    </DsfrCard>
    <DsfrCard
      horizontal={estBureau}
      title="NIS 2"
      hasDescription
      description="Vérifiez si votre organisation est concernée par la directive NIS 2 et et renforcez dès à présent le niveau de cybersécurité de votre organisation."
      href="/nis2"
      enlarge
    >
      <div slot="image" class="image-carte nis2">
        <img src="/assets/images/nis2-verticale.svg" alt="" />
      </div>
    </DsfrCard>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .cartes {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include a-partir-de(sm) {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .image-carte {
      display: grid;
      place-items: center;
      aspect-ratio: 16/9;

      &.guides-ressources {
        background-color: var(--background-flat-blue-france);
        img {
          width: 80%;
          scale: 0.9;
        }
      }

      &.nis2 {
        background-color: var(--background-contrast-blue-france);
        img {
          height: 70%;
        }
      }

      @include a-partir-de(lg) {
        aspect-ratio: unset;
        height: 100%;

        &.guides-ressources {
          img {
            width: 100%;
            scale: 1;

            object-fit: cover;
            object-position: center;
            height: 100%;
          }
        }
      }
    }
  }
</style>
