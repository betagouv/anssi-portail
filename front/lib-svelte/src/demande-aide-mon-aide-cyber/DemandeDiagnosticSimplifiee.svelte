<script lang="ts">
  import FoireAuxQuestions from './FoireAuxQuestions.svelte';
  import FormulaireDemandeSimplifiee from './FormulaireDemandeSimplifiee.svelte';

  export let origine: string;
  export let urlBase: string | undefined = '/api';
</script>

<div class="demande-diagnostic">
  <div class="explications">
    <hgroup>
      <h2>Protégez rapidement votre organisation des cyberattaques.</h2>
      <p>
        Profitez d’un premier diagnostic cyber gratuit accompagné par un Aidant
        cyber et recevez 6 recommandations prioritaires à mettre en place pour
        améliorer la cybersécurité de votre organisation.
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
  </div>

  <div class="formulaire">
    <FormulaireDemandeSimplifiee {origine} {urlBase} />
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

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .demande-diagnostic {
    display: grid;
    grid-template-areas:
      'explications'
      'etapes'
      'formulaire'
      'faq';
    background-color: #fef6e3;
    padding: 40px 16px;
    border-radius: 8px;
    gap: 24px;

    @include a-partir-de(md) {
      padding: 40px;
    }

    @include a-partir-de(lg) {
      grid-template-areas:
        'explications formulaire'
        'faq faq';
    }

    .explications {
      grid-area: explications;

      hgroup {
        h2 {
          margin-bottom: 16px;
        }

        p {
          margin-bottom: 32px;
        }
      }
    }

    ol {
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
    }

    details {
      grid-area: faq;

      summary {
        padding: 8px 16px 8px 12px;
        border-radius: 8px;
        width: max-content;
        display: flex;
        gap: 4px;

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
</style>
