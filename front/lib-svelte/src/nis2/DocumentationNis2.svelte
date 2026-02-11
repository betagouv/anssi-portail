<script lang="ts"></script>

<dsfr-container id="documentation">
  <div class="contenu">
    <h2>Plaquette de présentation de la directive NIS 2</h2>
    <p>
      <dsfr-link href="#" label="Télécharger la plaquette" download></dsfr-link>
    </p>
    <img src="/assets/images/plaquette-nis2.avif" alt="Plaquette NIS 2" />

    <h2>Vidéo de présentation de la directive NIS 2</h2>
    <!-- Les sous-titres sont intégrés dans la vidéo -->
    <!-- svelte-ignore a11y_media_has_caption -->
    <video controls preload="metadata" poster=""> </video>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/grille' as *;
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    .contenu {
      display: flex;
      flex-direction: column;
      margin: 24px auto 72px;

      h2 {
        margin-bottom: 32px;
      }

      p {
        margin: 0 0 32px;
      }

      img {
        margin-bottom: 48px;
      }

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }
    }
  }
</style>
