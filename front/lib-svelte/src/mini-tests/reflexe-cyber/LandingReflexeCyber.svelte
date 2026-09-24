<script lang="ts">
  import type { PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import Lien from '../../ui/Lien.svelte';
  import IllustrationHerosReflexeCyber from './IllustrationHerosReflexeCyber.svelte';

  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Réflexe cyber&nbsp;: comment réagirez-vous en cas de cyberattaque&nbsp;?',
    branche: {
      nom: 'Faire le test !',
      lien: '/faire-le-test',
    },
  };
</script>

<HerosRiche
  {propriétésFilAriane}
  description="Un rançongiciel frappe votre organisation. Vivez six événements clés et choisissez, à chaque étape, le réflexe qui permettra de contenir la crise et de préparer la reprise d'activité."
  variante="cafe-creme"
  class="avec-image-fond"
  badges={[{ label: '⏱️ 8 minutes', accent: 'green-bourgeon' }]}
>
  {#snippet titreHtml()}
    Comment réagirez-vous en cas de cyber&shy;attaque&nbsp;?
  {/snippet}
  {#snippet illustration()}
    <figure class="illustration">
      <IllustrationHerosReflexeCyber />
    </figure>
  {/snippet}

  {#snippet actions()}
    <Lien apparence="bouton" libelle="Lancer la simulation" taille="lg" href="/reflexes-cyber-en-ligne/parcours" />
  {/snippet}
</HerosRiche>

<style lang="scss">
  .illustration {
    margin: 0 auto;
    width: 100%;
  }
</style>
