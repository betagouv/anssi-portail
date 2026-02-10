<script lang="ts">
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import CarrouselDesInterlocuteurs from '../interlocuteurs/CarrouselDesInterlocuteurs.svelte';
  import EquipeBizDev from '../interlocuteurs/EquipeBizDev.svelte';

  export let origine: string;
</script>

<dsfr-container>
  <div class="introduction">
    <h2>
      Découvrez les risques pour<br />votre collectivité en cas d’attaques
    </h2>
    <!-- Les sous-titres sont intégrés dans la vidéo -->
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      id="video-risques"
      src="https://messervicescyber-ressources.cellar-c2.services.clever-cloud.com/Video_Risques.mp4"
      controls
    ></video>
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

  .introduction {
    padding-bottom: 72px;
    margin-inline: auto;
    max-width: 100%;
    @include a-partir-de(md) {
      max-width: taille-pour-colonnes(10);
    }
    @include a-partir-de(lg) {
      padding-top: 24px;
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
