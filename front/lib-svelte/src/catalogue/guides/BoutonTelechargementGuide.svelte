<script lang="ts">
  import type { Guide } from '../Guide.types';

  export let guide: Guide;
</script>

{#if guide.documents.length === 1}
  <a href={guide.documents[0].url} target="_blank" class="bouton primaire">
    Télécharger le guide
  </a>
{/if}