<script lang="ts">
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import IllustrationHerosVraiFaux from './IllustrationHerosVraiFaux.svelte';
  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Cyberattaques : saurez-vous démêler le vrai du faux ?',
    branche: {
      nom: 'Faire le test !',
      lien: '/mini-tests',
    },
  };
</script>

<HerosRiche
  {propriétésFilAriane}
  description=""
  variante="cafe-creme"
  class="avec-image-fond"
  badges={[{ label: '⏱️ 3 minutes', accent: 'green-bourgeon' }]}
>
  {#snippet titreHtml()}
    Cyber&shy;attaques : saurez-vous démêler le vrai du faux ?
  {/snippet}
  {#snippet illustration()}
    <figure class="illustration">
      <IllustrationHerosVraiFaux />
    </figure>
  {/snippet}

  {#snippet actions()}
    <dsfr-button label="Démarrer le quiz" kind="primary" size="lg" href="/mini-tests/vrai-faux/jeu" markup="a"
    ></dsfr-button>
  {/snippet}
</HerosRiche>

<style lang="scss">
  .illustration {
    margin: 0 auto;
    width: 100%;
  }
</style>
