<script lang="ts">
  import { DsfrCard, DsfrContainer } from '@lab-anssi/ui-kit';
  import { profilStore } from '../stores/profil.store';
</script>

<div class="conteneur">
  <DsfrContainer>
    <h1>Bonjour {$profilStore?.prenom},</h1>

    <div class="autres-ressources">
      <h2 class="fr-h6">Autres ressources</h2>

      <div class="cartes">
        <DsfrCard
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
  </DsfrContainer>
</div>

<style lang="scss">
  .conteneur {
    padding: 4.5rem 0;
    background-color: var(--background-alt-beige-gris-galet, #f9f6f2);
  }

  .cartes {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .image-carte {
      display: grid;
      place-items: center;
      aspect-ratio: 16/9;

      &.guides-ressources {
        background-color: var(--background-flat-blue-france);
        padding: 1rem 0;
        img {
          width: 80%;
        }
      }

      &.nis2 {
        background-color: var(--background-contrast-blue-france);
        img {
          height: 70%;
        }
      }
    }
  }
</style>
