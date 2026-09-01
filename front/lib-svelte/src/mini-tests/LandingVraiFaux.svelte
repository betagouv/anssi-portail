<script lang="ts">
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
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
    Cyberattaques : saurez-vous démêler le vrai du faux ?
  {/snippet}
  {#snippet illustration()}
    <div></div>
  {/snippet}

  {#snippet actions()}
    <dsfr-button label="Démarrer le quiz" kind="primary" size="lg" href="/mini-tests/vrai-faux/jeu" markup="a"
    ></dsfr-button>
  {/snippet}
</HerosRiche>
