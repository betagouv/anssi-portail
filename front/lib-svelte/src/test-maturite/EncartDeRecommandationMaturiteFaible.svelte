<script lang="ts">
  import FoireAuxQuestions from '../demande-aide-mon-aide-cyber/FoireAuxQuestions.svelte';
  import FormulaireDemandeSimplifiee from '../demande-aide-mon-aide-cyber/FormulaireDemandeSimplifiee.svelte';
</script>

<section>
  <div class="contenu-section">
    <hgroup class="preambule">
      <h1>Passez à l'étape suivante</h1>
      <p>
        Votre résultat montre que votre organisation n’est pas suffisamment
        protégée face aux cyber menaces. L’ANSSI vous recommande de réaliser un
        diagnostic cyber (gratuit) afin de définir rapidement les actions
        prioritaires à mettre en place et renforcer votre cybersécurité.
      </p>
    </hgroup>
    <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
    <div class="demande-diagnostic">
      <hgroup>
        <h2>Protégez rapidement votre organisation des cyberattaques.</h2>
        <p>
          Profitez d’un premier diagnostic cyber gratuit accompagné par un
          Aidant cyber et recevez 6 recommandations prioritaires à mettre en
          place pour améliorer la cybersécurité de votre organisation.
        </p>
      </hgroup>
      <ol>
        <li>Complétez et envoyez votre demande</li>
        <li>Un aidant cyber vous contacte rapidement</li>
        <li>Réalisez votre diagnostic (en visio ou sur site – 1h)</li>
        <li>
          Recevez vos 6 recommandations prioritaires pour renforcer votre
          cybersécurité
        </li>
      </ol>

      <div class="formulaire">
        <FormulaireDemandeSimplifiee />
      </div>
      <details>
        <summary>
          <lab-anssi-icone nom="questionnaire-line"></lab-anssi-icone>
          Questions fréquentes
        </summary>
        <div class="faq">
          <h6>Questions les plus fréquentes</h6>
          <FoireAuxQuestions />
        </div>
      </details>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;
  .contenu-section {
    display: flex;
    flex-direction: column;
    gap: 24px;

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }

    hgroup.preambule {
      text-align: center;
      align-self: center;
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }
      h1 {
        font-size: 2rem;
        line-height: 2.5rem;
        margin: 0 0 24px;

        @include a-partir-de(md) {
          font-size: 2.5rem;
          line-height: 3rem;
        }
      }
    }

    lab-anssi-icone {
      align-self: center;
    }

    .demande-diagnostic {
      display: grid;
      grid-template-areas:
        'preambule'
        'etapes'
        'formulaire'
        'faq';
      background-color: #fef6e3;
      padding: 40px 16px;
      border-radius: 8px;

      @include a-partir-de(lg) {
        grid-template-areas:
          'preambule formulaire'
          'etapes formulaire'
          'faq faq';
      }

      hgroup {
        grid-area: preambule;
        h2 {
          margin-bottom: 16px;
        }

        p {
          margin-bottom: 32px;
        }
      }
      ol {
        grid-area: etapes;
        display: flex;
        flex-direction: column;
        gap: 16px;
        counter-reset: li;
        list-style: none;
        padding: 0;
        li {
          display: flex;
          gap: 12px;

          &::before {
            flex: 0 0 16px;
            align-self: flex-start;
            height: 16px;
            line-height: 100%;
            text-align: center;
            font-weight: bold;
            border-radius: 4px;
            padding: 4px;
            background-color: var(--noir);
            color: white;
            content: counter(li);
            counter-increment: li;
          }
        }
      }

      .formulaire {
        grid-area: formulaire;
        background-color: white;
        padding: 24px;
        border: 1px solid #ddd;
        margin-bottom: 24px;
      }
      details {
        grid-area: faq;
        summary {
          padding: 8px 16px 8px 12px;
          border-radius: 8px;
          width: max-content;
          &:hover {
            background-color: rgb(from var(--noir) r g b / 4%);
            cursor: pointer;
          }
          &:active {
            background-color: rgb(from var(--noir) r g b / 8%);
            cursor: pointer;
          }
          &::marker {
            content: '';
          }
          &::-webkit-details-marker {
            display: none;
          }
        }
        .faq {
          background-color: white;
          padding: 48px 16px;
          margin-top: 32px;
          h6 {
            font-weight: bold;
            font-size: 1.125rem;
            line-height: 1.5rem;
            margin-block: 0 24px;
          }
        }
      }
    }
  }
</style>
