<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import FilAriane from '../../ui/FilAriane.svelte';
</script>

<dsfr-container>
  <FilAriane
    feuille="Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?"
    branche={{ nom: 'Faire le test !', lien: '/mini-tests' }}
  />
  <h1 class="fr-h6">Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?</h1>
  <div class="conteneur-de-choix">
    <button use:clic={() => {}} class="vote-faux" aria-label="Vote-Faux">
      <lab-anssi-icone nom="thumb-down-fill"></lab-anssi-icone>
      <p class="texte-standard-md vote-faux">Faux</p>
    </button>
    <div class="question">
      <span class="compte texte-detail-sm">1/6</span>
      <p class="fr-h2">🏢</p>
      <h2 class="fr-h3">
        Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.
      </h2>
    </div>
    <button use:clic={() => {}} class="vote-vrai" aria-label="Vote-Vrai">
      <lab-anssi-icone nom="thumb-up-fill"></lab-anssi-icone>
      <p class="texte-standard-md vote-vrai">Vrai</p>
    </button>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/grille' as *;
  dsfr-container {
    display: flex;
    background-color: #f5f5fe;
    flex-direction: column;

    h1 {
      text-align: center;
    }

    .conteneur-de-choix {
      --icon-size: 2.5rem;
      width: taille-pour-colonnes(10);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding-bottom: 4.5rem;
      margin-inline: auto;

      .question {
        display: flex;
        padding: 2rem;
        flex-direction: column;
        align-items: flex-start;
        border-radius: 0.5rem;
        background: var(--background-default-grey);
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
        box-sizing: border-box;
        width: 40%;

        .compte {
          display: flex;
          padding: 0.25rem 0.75rem;
          justify-content: center;
          align-self: flex-end;
          gap: 0.25rem;
          background-color: var(--background-contrast-grey);
          border-radius: 100px;
          color: var(--text-title-grey);
          text-align: center;
        }
      }

      button {
        display: flex;
        padding: 3.5rem 1rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        flex: 1 0 0;
        border-radius: 1.5rem;
        border: 0;
        width: 30%;
      }

      .vote-faux {
        background-color: var(--background-contrast-error);
        color: var(--text-default-error);
      }

      .vote-vrai {
        background-color: var(--background-contrast-success);
        color: var(--text-default-success);
      }
    }
  }
</style>
