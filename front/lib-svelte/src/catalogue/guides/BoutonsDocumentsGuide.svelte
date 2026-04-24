<script lang="ts">
  import Lien from '../../ui/Lien.svelte';
  import type { Guide } from '../Guide.types';
  import { decodeEntitesHtml } from './guide';

  export let guide: Guide;
  export let autoriseMultiple: boolean = false;
</script>

{#if guide.documents.length === 1}
  <div class="zone-action">
    <Lien
      href={guide.documents[0].url}
      blank
      libelle="Télécharger le guide"
      apparence="bouton"
      taille="lg"
      data-source="Page guide"
      data-cible={guide.nom}
      class="lien-externe-produit "
    ></Lien>
  </div>
{:else if guide.documents.length > 1 && autoriseMultiple}
  <div class="documents">
    {#each guide.documents as document (document.url)}
      <Lien
        href={document.url}
        blank
        libelle={decodeEntitesHtml(document.libelle)}
        apparence="bouton"
        taille="lg"
        data-source="Page guide"
        data-cible={guide.nom}
        class="lien-externe-produit"
      ></Lien>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use '../../../../assets/styles/responsive.scss' as *;

  .documents {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 24px;
  }

  .zone-action {
    padding-top: 24px;
    padding-bottom: 40px;
  }
</style>
