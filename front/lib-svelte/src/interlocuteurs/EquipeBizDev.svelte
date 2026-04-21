<script lang="ts">
  import Lien from '../ui/Lien.svelte';
</script>

<div class="contenu">
  <div class="photos">
    <img src="/assets/images/floriane-bizdev.avif" alt="Floriane Gallego" />
  </div>
  <h2>Notre équipe est à votre écoute</h2>
  <p class="texte-standard-md">
    Participer à un webinaire collectif de 45 minutes pour en savoir plus sur MesServicesCyber, le test de maturité et
    le diagnostic cyber afin de mieux protéger votre entité des cyberattaques.
  </p>
  <div class="boutons">
    <Lien
      apparence="bouton"
      blank
      href="https://app.livestorm.co/lab-anssi/webinaire-cyberdepart"
      libelle="assister au webinaire"
      type="primaire"
    />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .contenu {
    display: grid;
    grid-template-areas: 'titre' 'contenu' 'bouton' 'photos';
    @include a-partir-de(lg) {
      grid-template-areas: 'titre photos' 'contenu photos' 'bouton photos';
      grid-template-columns: 2fr 1fr;
    }

    .photos {
      grid-area: photos;
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
      align-self: center;

      img {
        width: 164px;
        height: 164px;
        border-radius: 50%;
        border: 6px solid white;

        &:first-of-type {
          margin-right: -20px;
        }

        &:last-of-type {
          margin-left: -20px;
        }
      }
    }

    h2 {
      grid-area: titre;
      margin-bottom: 12px;
    }

    p {
      grid-area: contenu;
      margin: 0 0 32px;
    }

    .boutons {
      grid-area: bouton;
      justify-self: flex-start;
      margin-bottom: 32px;
    }
  }
</style>
