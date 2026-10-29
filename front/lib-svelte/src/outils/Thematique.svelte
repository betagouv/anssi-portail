<script lang="ts">
  type Props = {
    titre: string;
    cheminAperçu: string;
    titreEmail: string;
    description: string;
  };

  const { titre, cheminAperçu, titreEmail, description }: Props = $props();
</script>

<div class="thématique">
  <h3 class="fr-h6">{titre}</h3>
  <div class="aperçu">
    <img src={cheminAperçu} alt="" />
    <div class="email">
      <div class="entête">
        <lab-anssi-icone nom="mail-fill" taille="sm"></lab-anssi-icone>
      </div>
      <div class="corps">
        <p>{titreEmail}</p>
        <div class="largeur-complète"></div>
        <div class="largeur-complète"></div>
        <div class="demi-largeur"></div>
        <div class="largeur-complète"></div>
        <div class="largeur-complète"></div>
        <div class="largeur-complète"></div>
        <div class="demi-largeur"></div>
      </div>
    </div>
  </div>
  <p class="texte-standard-md">{description}</p>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .thématique {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;

    &:nth-child(1) {
      background-color: var(--background-alt-yellow-moutarde);
      .aperçu > .email > .entête {
        background-color: var(--artwork-motif-yellow-moutarde);
      }
    }
    &:nth-child(2) {
      background-color: var(--background-alt-pink-macaron);
      .aperçu > .email > .entête {
        background-color: var(--artwork-motif-pink-macaron);
      }
    }
    &:nth-child(3) {
      background-color: var(--background-alt-blue-cumulus);
      .aperçu > .email > .entête {
        background-color: var(--artwork-motif-blue-cumulus);
      }
    }
    &:nth-child(4) {
      background-color: var(--background-alt-purple-glycine);
      .aperçu > .email > .entête {
        background-color: var(--artwork-motif-purple-glycine);
      }
    }
    &:nth-child(5) {
      background-color: var(--background-alt-beige-gris-galet);
      .aperçu > .email > .entête {
        background-color: var(--artwork-motif-beige-gris-galet);
      }
    }
    &:nth-child(6) {
      background-color: var(--background-alt-green-bourgeon);
      .aperçu > .email > .entête {
        background-color: var(--artwork-motif-green-bourgeon);
      }
    }

    .aperçu {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-inline: auto;
      width: 100%;
      max-width: 22rem;

      img {
        object-fit: cover;
        flex: 0.55;
        width: 0;
      }

      .email {
        flex: 0.45;
        width: 0;
        color: var(--text-title-blue-france);

        .entête {
          border-radius: 3.7px 3.7px 0px 0px;
          padding: 0.25rem 0.375rem;

          @include a-partir-de(lg) {
            padding: 0.375rem 0.5rem;
          }
        }

        .corps {
          border-radius: 0px 0px 3.7px 3.7px;
          padding: 0.375rem 0.5rem 0.5rem 0.5rem;
          background-color: var(--background-default-grey);

          @include a-partir-de(lg) {
            padding: 0.5rem 0.75rem 0.75rem 0.75rem;
          }

          p {
            font-weight: bold;
            font-size: 0.5rem;
            line-height: normal;
            padding-bottom: 0.5rem;
          }

          .largeur-complète,
          .demi-largeur {
            height: 0.375rem;
            margin-bottom: 0.25rem;
            border-radius: 999px;
            background-color: var(--background-contrast-blue-france);
          }

          .demi-largeur {
            width: 50%;

            &:nth-child(1 of .demi-largeur) {
              margin-bottom: 0.75rem;
            }
          }
        }
      }
    }
  }
</style>
