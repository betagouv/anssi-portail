<script lang="ts">
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import CarrouselDesInterlocuteurs from '../interlocuteurs/CarrouselDesInterlocuteurs.svelte';
  import EquipeBizDev from '../interlocuteurs/EquipeBizDev.svelte';

  export let origine: string;
</script>

<dsfr-container class="proteger">
  <div class="introduction">
    <h2>
      Découvrez les risques pour votre organisation en cas de cyberattaque
    </h2>
    <!-- Les sous-titres sont intégrés dans la vidéo -->
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      id="video-risques"
      controls
      preload="metadata"
      poster="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.avif"
    >
      <source
        src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.av1.mp4"
        type="video/mp4; codecs=av01.0.05M.08"
      />
      <source
        src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.webm"
        type='video/webm; codecs="vp9,opus"'
      />
      <source
        src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.mp4"
        type="video/mp4; codecs=avc1.42E01E"
      />
    </video>
  </div>

  <div class="demande">
    <DemandeDiagnosticSimplifiee {origine} />
  </div>

  <div class="interlocuteurs">
    <CarrouselDesInterlocuteurs />
  </div>
</dsfr-container>

<dsfr-container class="equipe-biz-dev">
  <EquipeBizDev />
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .proteger {
    margin-top: 48px;
    
    .introduction {
      padding-bottom: 72px;
      margin-inline: auto;
      max-width: 100%;
      @include a-partir-de(md) {
        max-width: taille-pour-colonnes(10);
      }
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(6);
      }

      h2 {
        text-align: center;
        margin-bottom: 48px;
      }

      video {
        width: 100%;
      }
    }
  }

  .demande {
    padding-block: 40px;
  }

  .interlocuteurs {
    margin-inline: auto;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(10);
    }
  }

  .equipe-biz-dev {
    padding-block: 56px;
    background-color: var(--background-alt-blue-france);
  }
</style>
