<script lang="ts">
  import { DsfrCard, DsfrContainer } from '@lab-anssi/ui-kit';
  import { profilStore } from '../stores/profil.store';
  import Lien from '../ui/Lien.svelte';

  const estMdEtPlus = $derived(window.matchMedia('(min-width: 768px)').matches);
</script>

<div class="conteneur-externe">
  <DsfrContainer>
    <div class="conteneur-interne">
      <h1>Bonjour {$profilStore?.prenom},</h1>

      <div class="autres-ressources">
        <h2 class="fr-h6">Autres ressources</h2>

        <div class="cartes">
          <DsfrCard
            horizontal={estMdEtPlus}
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
            horizontal={estMdEtPlus}
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

      <Lien libelle="Haut de page" href="#" taille="md" icone="arrow-up-fill" />
    </div>
  </DsfrContainer>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .conteneur-externe {
    padding: 4.5rem 0;
    background-color: var(--background-alt-beige-gris-galet, #f9f6f2);

    .conteneur-interne {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

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

        @include a-partir-de(md) {
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
  }
</style>
