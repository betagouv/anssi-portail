<script lang="ts"></script>

<dsfr-container id="documentation">
  <div class="contenu">
    <div class="presentation">
      <h2>Présentation de la directive NIS 2</h2>
      <ul>
        <li>
          <dsfr-link
            href="/documents-ressources/2026-03-27-NIS2.pdf"
            label="Télécharger la présentation NIS 2 (PDF)"
            download=""
            blank
            detail="PDF - 12,0 Mo"
          ></dsfr-link>
        </li>
        <li>
          <dsfr-link
            href="/documents-ressources/2026-03-27-NIS2.pptx"
            label="Télécharger la présentation NIS 2 (PPTX)"
            download=""
            blank
            detail="PPTX - 11,2 Mo"
          ></dsfr-link>
        </li>
      </ul>
      <img
        src="/assets/images/photo-livret-nis2.avif"
        alt="Illustration du livret de présentation de la directive NIS 2"
      />
    </div>
    <div class="faq">
      <hgroup>
        <h2>Foire aux questions</h2>
        <p>
          Certaines questions-réponses dépendent de l’issue du débat parlementaire et des consultations sur les textes
          réglementaires, dans le cadre du processus de transposition. Les questions-réponses de cette FAQ seront mises
          à jour en conséquence.
        </p>
      </hgroup>
      <dsfr-link label="Consulter la FAQ" href="https://aide.monespacenis2.cyber.gouv.fr/fr/" blank></dsfr-link>
      <img src="/assets/images/illustration-faq-NIS2.avif" alt="Foire aux questions de mon espace NIS 2" />
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

      p {
        margin: 0 0 32px;
      }

      img {
        margin-bottom: 48px;
      }

      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(8);
      }

      .presentation {
        display: flex;
        flex-direction: column;

        ul {
          margin: 0 0 24px;
          padding-inline-start: 1em;
        }
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
