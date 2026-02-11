<script lang="ts"></script>

<dsfr-container id="documentation">
  <div class="contenu">
    <h2>Plaquette de présentation de la directive NIS 2</h2>
    <p>
      <dsfr-link href="#" label="Télécharger la plaquette" download></dsfr-link>
    </p>
    <img src="/assets/images/plaquette-nis2.avif" alt="Plaquette NIS 2" />

    <h2>Vidéo de présentation de la directive NIS 2</h2>
    <div class="video">
      <!-- Les sous-titres sont intégrés dans la vidéo -->
      <!-- svelte-ignore a11y_media_has_caption -->
      <video
        controls
        preload="metadata"
        poster="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/focus-nis2-episode2.avif"
      >
        <source
          src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/focus-nis2-episode2.av1.mp4"
          type="video/mp4; codecs=av01.0.05M.08"
        />
        <source
          src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/focus-nis2-episode2.webm"
          type="video/webm; codecs='vp9,opus'"
        />
        <source
          src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/focus-nis2-episode2.mp4"
          type="video/mp4; codecs=avc1.42E01E"
        />
      </video>
    </div>
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

      .video {
        background: black;

        video {
          aspect-ratio: 16 / 10;
          height: 100%;
          width: 100%;
        }
      }

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }
    }
  }
</style>
