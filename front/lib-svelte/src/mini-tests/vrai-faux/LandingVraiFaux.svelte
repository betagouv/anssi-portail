<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import type { PropriétésFilAriane } from '../../ui/filAriane';

  import HerosRiche from '../../ui/HerosRiche.svelte';
  import Lien from '../../ui/Lien.svelte';

  import IllustrationHerosVraiFaux from './IllustrationHerosVraiFaux.svelte';

  const { mode, suivant, urlBase = '' }: { mode?: 'autonome'; suivant?: () => void; urlBase?: string } = $props();

  const propriétésFilAriane: PropriétésFilAriane | undefined = $derived(
    mode === 'autonome'
      ? undefined
      : {
          feuille: 'Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?',
          branche: {
            nom: 'Faire le test !',
            lien: '/faire-le-test',
          },
        }
  );
</script>

<HerosRiche
  {propriétésFilAriane}
  description=""
  variante="cafe-creme"
  class="avec-image-fond"
  badges={[{ label: '⏱️ 3 minutes', accent: 'green-bourgeon' }]}
  {urlBase}
>
  {#snippet titreHtml()}
    Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?
  {/snippet}
  {#snippet illustration()}
    <figure class="illustration">
      <IllustrationHerosVraiFaux {urlBase} />
    </figure>
  {/snippet}

  {#snippet actions()}
    {#if mode === 'autonome'}
      <Bouton libelle="Démarrer le quiz" taille="lg" surClic={suivant}></Bouton>
    {:else}
      <Lien apparence="bouton" libelle="Démarrer le quiz" taille="lg" href="/vrai-faux/quiz" />
    {/if}
  {/snippet}
</HerosRiche>

<style lang="scss">
  .illustration {
    margin: 0 auto;
    width: 100%;
  }
</style>
