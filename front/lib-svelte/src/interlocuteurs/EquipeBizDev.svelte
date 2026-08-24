<script lang="ts">
  import IllustrationCompositionBizDev from './animation/IllustrationCompositionBizDev.svelte';
</script>

<div class="contenu-biz-dev">
  <dsfr-card
    title="Notre équipe est à votre écoute"
    has-description
    description="Participez à un webinaire collectif de 45 minutes pour en savoir plus sur MesServicesCyber, le test de maturité et le diagnostic cyber afin de mieux savoir comment protéger votre entité des cyberattaques."
    href="https://app.livestorm.co/lab-anssi/webinaire-cyberdepart"
    enlarge
    no-icon
    has-buttons
  >
    <dsfr-button
      label="Assister au webinaire"
      kind="secondary"
      size="md"
      has-icon
      icon="calendar-event-fill"
      icon-place="left"
      markup="a"
      href="https://app.livestorm.co/lab-anssi/webinaire-cyberdepart"
      slot="buttonsgroup"
    ></dsfr-button>
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
      @include a-partir-de(lg) {
        flex: 1;
      }
    }

    figure {
      margin: 0;
      max-width: 588px;

      @include a-partir-de(lg) {
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
