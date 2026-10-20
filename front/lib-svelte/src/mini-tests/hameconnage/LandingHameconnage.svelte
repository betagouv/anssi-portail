<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import EnteteAutonome from '../../ui/EnteteAutonome.svelte';
  import type { PropriétésFilAriane } from '../../ui/filAriane';
  import HerosRiche from '../../ui/HerosRiche.svelte';
  import Lien from '../../ui/Lien.svelte';
  import IllustrationHerosHameconnage from './IllustrationHerosHameconnage.svelte';

  const { mode, suivant, urlBase = '' }: { mode?: 'autonome'; suivant?: () => void; urlBase?: string } = $props();

  const propriétésFilAriane: PropriétésFilAriane | undefined = $derived(
    mode === 'autonome'
      ? undefined
      : {
          feuille: 'Hameçonnage&nbsp;: saurez-vous distinguez le mail légitime du faux&nbsp;?',
          branche: {
            nom: 'Faire le test !',
            lien: '/faire-le-test',
          },
        }
  );
</script>

{#snippet herosRiche()}
  <HerosRiche
    {propriétésFilAriane}
    description=""
    variante="cafe-creme"
    class="avec-image-fond"
    badges={[{ label: '⏱️ 3 minutes', accent: 'green-bourgeon' }]}
    tailleBadges="md"
    {urlBase}
  >
    {#snippet titreHtml()}
      Hame&shy;çonnage&nbsp;: saurez-vous distinguez le mail légitime du faux&nbsp;?
    {/snippet}
    {#snippet illustration()}
      <figure class="illustration">
        <IllustrationHerosHameconnage {urlBase} />
      </figure>
    {/snippet}

    {#snippet actions()}
      {#if mode === 'autonome'}
        <Bouton libelle="Démarrer le quiz" taille="lg" surClic={suivant}></Bouton>
      {:else}
        <Lien apparence="bouton" libelle="Démarrer le test" taille="lg" href="/hameconnage/test" />
      {/if}
    {/snippet}
  </HerosRiche>
{/snippet}

{#if mode === 'autonome'}
  <div class="entete">
    <dsfr-container>
      <EnteteAutonome {urlBase} />
    </dsfr-container>
    {@render herosRiche()}
  </div>
{:else}
  {@render herosRiche()}
{/if}

<style lang="scss">
  .illustration {
    margin: 0 auto;
    width: 100%;
  }

  .entete {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: var(--brown-cafe-creme-975-75);
  }
</style>
