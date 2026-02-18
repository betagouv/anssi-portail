<script lang="ts"></script>

<dsfr-container id="documentation">
  <div class="contenu">
    <h2>Plaquette de présentation de la directive NIS 2</h2>
    <p>
      <dsfr-link
        href="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Plaquette_NIS2_2024.pdf"
        label="Télécharger la plaquette"
        download
        blank
      ></dsfr-link>
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

    <div class="faq">
      <hgroup>
        <h2>Foire aux questions</h2>
        <p>
          Certaines questions-réponses dépendent de l’issue du débat
          parlementaire et des consultations sur les textes réglementaires, dans
          le cadre du processus de transposition. Les questions-réponses de
          cette FAQ seront mises à jour en conséquence.
        </p>
      </hgroup>
      <dsfr-link
        label="Consulter la FAQ"
        href="https://aide.monespacenis2.cyber.gouv.fr/fr/"
        blank
      ></dsfr-link>
      <img
        src="/assets/images/illustration-faq-NIS2.avif"
        alt="Foire aux questions de mon espace NIS 2"
      />
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
        max-width: taille-pour-colonnes(8);
      }
      .faq {
        display: flex;
        flex-direction: column;
        margin-top: 48px;
        gap: 32px;

        h2 {
          margin-bottom: 8px;
        }
        p,
        img {
          margin: 0;
        }
      }
    }
  }
</style>
