<script lang="ts">
  import { getDocument } from 'pdfjs-dist';
  import 'pdfjs-dist/build/pdf.worker.mjs';
  import Bouton from '../../ui/Bouton.svelte';
  import Modale from '../../ui/Modale.svelte';

  type Props = {
    aperçuEnCours: boolean;
    générationEnCours: boolean;
    pdfs: Uint8Array<ArrayBuffer>[];
  };

  let { aperçuEnCours = $bindable(), générationEnCours, pdfs = [] }: Props = $props();
  let indexPrévisualisation: number = $state(0);
  let statutConversion: 'non complété' | 'complété' | 'échoué' = $state('non complété');
  let URLImages: string[] = $state([]);

  const convertitPDFEnImages = async (pdf: Uint8Array<ArrayBuffer>) => {
    const chargementPDF = getDocument({ data: pdf.slice() });
    const documentPDF = await chargementPDF.promise;

    try {
      const page = await documentPDF.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({ canvas, viewport }).promise;

      const image = await new Promise<Blob>((résout, rejette) => {
        canvas.toBlob((blob) => (blob ? résout(blob) : rejette(new Error('Conversion du PDF en image impossible'))));
      });
      return [await image.arrayBuffer()];
    } finally {
      await chargementPDF.destroy();
    }
  };

  $effect(() => {
    pdfs;
    indexPrévisualisation = 0;
    statutConversion = 'non complété';

    const effect = async () => {
      const promessesDeConversion = pdfs.map(convertitPDFEnImages);

      try {
        const images = (await Promise.all(promessesDeConversion)).map((pages) => pages[0]);
        URLImages = images.map((arrayBuffer) => URL.createObjectURL(new Blob([arrayBuffer], { type: 'image/png' })));
        statutConversion = 'complété';
      } catch {
        statutConversion = 'échoué';
      }
    };

    effect();
  });

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
      {#if statutConversion === 'non complété' || générationEnCours}
        <div class="skeleton"></div>
      {:else if statutConversion === 'échoué'}
        <p role="alert">L’aperçu n’a pas pu être généré.</p>
      {:else}
        <img
          src={URLImages[indexPrévisualisation]}
          alt={`Aperçu de l’affiche ${indexPrévisualisation + 1} sur ${pdfs.length}`}
        />
      {/if}
    </div>
    <div class="pagination">
      <Bouton
        desactive={indexPrévisualisation === 0 || statutConversion !== 'complété' || générationEnCours}
        libelle="Précédent"
        type="secondaire"
        taille="sm"
        surClic={aperçuPrécédent}
      />
      {#if statutConversion !== 'complété' || générationEnCours}
        <span>-/-</span>
      {:else}
        <span>{indexPrévisualisation + 1}/{pdfs.length}</span>
      {/if}
      <Bouton
        desactive={indexPrévisualisation === pdfs.length - 1 || statutConversion !== 'complété' || générationEnCours}
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

      img,
      .skeleton {
        display: block;
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 0;
      }

      img {
        object-fit: contain;
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
