<script lang="ts">
  import type { Guide } from '../Guide.types';

  export let guide: Guide;
  export let autoriseMultiple: boolean = false;
</script>

{#if guide.documents.length === 1}
  <a href={guide.documents[0].url} target="_blank" class="bouton primaire">
    Télécharger le guide
  </a>
{:else if guide.documents.length > 1 && autoriseMultiple}
  <div class="documents">
    {#each guide.documents as document (document.libelle)}
      <a href={document.url} target="_blank" class="bouton primaire">
         {document.libelle}
      </a>
    {/each}
  </div>
{/if}

<style lang="scss">
  .documents {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 24px;
  }
</style>
