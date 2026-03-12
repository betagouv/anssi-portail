<script lang="ts">
  import { formateContenuExigence, type Exigence } from '../exigence.type';

  export let exigence: Exigence;
</script>

<div class="texte-detail-sm">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html formateContenuExigence(exigence)}
</div>

<style lang="scss">
  .texte-detail-sm {
    margin: 8px 0 0;

    :global(p),
    :global(ul) {
      margin: 0;
    }
  }
</style>
