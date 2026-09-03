<script lang="ts">
  import FilAriane from '../../../ui/FilAriane.svelte';
  import Question from './question/Question.svelte';

  const vrai = () => {
    console.log('vrai');
  };
  const faux = () => {
    console.log('faux');
  };
</script>

<dsfr-container>
  <FilAriane
    feuille="Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?"
    branche={{ nom: 'Faire le test !', lien: '/faire-le-test' }}
  />
  <h1 class="fr-h6">Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?</h1>
  <Question
    question="Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE."
    surVoteVrai={vrai}
    surVoteFaux={faux}
  />
</dsfr-container>

<style lang="scss">
  dsfr-container {
    display: flex;
    background-color: var(--background-alt-blue-france);
    flex-direction: column;

    h1 {
      text-align: center;
    }
  }
</style>
