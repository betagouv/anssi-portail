<script lang="ts"></script>

<dsfr-container id="documentation">
  <div class="contenu">
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

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(8);
      }
      .faq {
        display: flex;
        flex-direction: column;
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
