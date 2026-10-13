<script lang="ts">
  import IllustrationCompositionBizDev from './animation/IllustrationCompositionBizDev.svelte';
</script>

<div class="contenu-biz-dev">
  <dsfr-card
    title="Notre équipe est à votre écoute"
    has-description
    description="Une question sur MesServicesCyber, le parcours de sécurisation ou un autre sujet ? Notre équipe vous répond et vous aide à identifier les prochaines étapes pour protéger votre entité."
    href="https://aide.messervices.cyber.gouv.fr/fr/?chat=ouvert"
    enlarge
    no-icon
    size="sm"
  >
  </dsfr-card>

  <div class="visuel">
    <div class="illustration">
      <figure>
        <IllustrationCompositionBizDev />
      </figure>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .contenu-biz-dev {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @include a-partir-de(lg) {
      flex-direction: row;
    }

    .visuel {
      width: 100%;
      @include a-partir-de(lg) {
        flex: 1;
      }
    }

    figure {
      margin-inline: auto;
      max-width: 588px;

      @include a-partir-de(lg) {
        margin: 0;
        max-width: 100%;
      }
    }

    :global(.illustration-animee) {
      height: auto;
      max-width: 100%;
    }

    dsfr-card {
      min-height: auto;
      @include a-partir-de(lg) {
        flex: 1;
        order: 1;
      }
    }
  }
</style>
