<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import Modale from '../../ui/Modale.svelte';

  type Props = {
    aperçuEnCours: boolean;
    générationEnCours: boolean;
    pdfs: Uint8Array<ArrayBuffer>[];
  };

  let { aperçuEnCours = $bindable(), générationEnCours, pdfs = [] }: Props = $props();

  let indexPrévisualisation: number = $state(0);
  let URLPDFS = $derived(pdfs.map((pdf) => URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))));

  const aperçuPrécédent = () => {
    if (indexPrévisualisation <= 0) return;
    indexPrévisualisation--;
  };

  const aperçuSuivant = () => {
    if (indexPrévisualisation >= pdfs.length - 1) return;
    indexPrévisualisation++;
  };
</script>

<Modale titre="Aperçu" bind:estOuverte={aperçuEnCours}>
  <div class="contenu-aperçu">
    <div class="aperçu">
      {#if générationEnCours}
        <div class="skeleton"></div>
      {:else}
        <object type="application/pdf" title="Aperçu" data={URLPDFS[indexPrévisualisation]}> </object>
      {/if}
    </div>
    <div class="pagination">
      <Bouton
        desactive={indexPrévisualisation === 0}
        libelle="Précédent"
        type="secondaire"
        taille="sm"
        surClic={aperçuPrécédent}
      />
      {#if générationEnCours}
        <span>-/-</span>
      {:else}
        <span>{indexPrévisualisation + 1}/{pdfs.length}</span>
      {/if}
      <Bouton
        desactive={indexPrévisualisation === pdfs.length - 1}
        libelle="Suivant"
        type="secondaire"
        taille="sm"
        surClic={aperçuSuivant}
      />
    </div>
  </div>
</Modale>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .contenu-aperçu {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: calc(100dvh - 12.5rem);
    overflow: hidden;

    background-color: var(--background-alt-blue-france);
    padding: 1rem;

    @include a-partir-de(md) {
      height: calc(80dvh - 12.5rem);
    }

    .aperçu {
      display: flex;
      flex: 1;
      justify-content: center;
      min-height: 0;

      object,
      .skeleton {
        display: block;
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 0;
      }

      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
      }
    }

    .pagination {
      display: flex;
      flex: none;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
</style>
