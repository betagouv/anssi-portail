<script module lang="ts">
  // @ts-expect-error pas de types pour le worker pdf.js, import pour effet de bord
  await import('pdfjs-dist/build/pdf.worker.mjs');
  const { getDocument } = await import('pdfjs-dist');
</script>

<script lang="ts">
  import Bouton from '../../ui/Bouton.svelte';
  import Modale from '../../ui/Modale.svelte';
  import { archiveKit } from './archiveKit.svelte';

  type Props = {
    aperçuEnCours: boolean;
  };

  let { aperçuEnCours = $bindable() }: Props = $props();
  let indexPrévisualisation: number = $state(0);

  const récupèrePromesseDeConversion = async (pdf: Uint8Array<ArrayBuffer>) => {
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

  const convertitPDFsEnImages = async () => {
    const { pdfs } = await archiveKit.génère();
    const promessesDeConversion = pdfs.map(récupèrePromesseDeConversion);
    const images = (await Promise.all(promessesDeConversion)).map((pages) => pages[0]);
    return images.map((arrayBuffer) => URL.createObjectURL(new Blob([arrayBuffer], { type: 'image/png' })));
  };

  const aperçuPrécédent = () => {
    if (indexPrévisualisation <= 0) return;
    indexPrévisualisation--;
  };

  const aperçuSuivant = (nombreAperçus: number) => {
    if (indexPrévisualisation >= nombreAperçus - 1) return;
    indexPrévisualisation++;
  };
</script>

<Modale titre="Aperçu" bind:estOuverte={aperçuEnCours} surFermeture={() => (indexPrévisualisation = 0)}>
  <div class="contenu-aperçu">
    {#await convertitPDFsEnImages()}
      <div class="aperçu">
        <div class="skeleton"></div>
      </div>
      <div class="pagination">
        <Bouton desactive libelle="Précédent" type="secondaire" taille="sm" />
        <span>-/-</span>
        <Bouton desactive libelle="Suivant" type="secondaire" taille="sm" />
      </div>
    {:then URLsImages}
      <div class="aperçu">
        <img
          src={URLsImages[indexPrévisualisation]}
          alt={`Aperçu de l’affiche ${indexPrévisualisation + 1} sur ${URLsImages.length}`}
        />
      </div>
      <div class="pagination">
        <Bouton
          desactive={indexPrévisualisation === 0}
          libelle="Précédent"
          type="secondaire"
          taille="sm"
          surClic={aperçuPrécédent}
        />
        <span>{indexPrévisualisation + 1}/{URLsImages.length}</span>
        <Bouton
          desactive={indexPrévisualisation >= URLsImages.length - 1}
          libelle="Suivant"
          type="secondaire"
          taille="sm"
          surClic={() => aperçuSuivant(URLsImages.length)}
        />
      </div>
    {:catch}
      <div class="aperçu">
        <p role="alert">L’aperçu n’a pas pu être généré.</p>
      </div>
      <div class="pagination">
        <Bouton desactive libelle="Précédent" type="secondaire" taille="sm" />
        <span>-/-</span>
        <Bouton desactive libelle="Suivant" type="secondaire" taille="sm" />
      </div>
    {/await}
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
