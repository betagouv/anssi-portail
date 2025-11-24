<script lang="ts">
  import type { Guide } from '../Guide.types';
  import { decodeEntitesHtml } from './guide';

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
        {decodeEntitesHtml(document.libelle)}
      </a>
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
  .bouton {
    margin-top: 24px;
    margin-bottom: 40px;
    padding: 10px 28px;

    @include a-partir-de(md) {
      width: fit-content;
    }
  }
</style>
