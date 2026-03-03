<script lang="ts">
  import { formateContenuExigence, type ExigenceISO } from '../exigence.type';

  export let exigence: ExigenceISO;

  $: accent =
    exigence.norme === 'ISO 27001' ? 'purple-glycine' : 'blue-cumulus';
</script>

<td>
  <dsfr-badge label={exigence.norme} type="accent" {accent}></dsfr-badge>
  {#if exigence.chapitre}
    <p class="texte-detail-sm gras">{exigence.chapitre}</p>
  {/if}
  <div class="texte-detail-sm">
    {@html formateContenuExigence(exigence)}
  </div>
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;

    .gras {
      font-weight: bold;
    }

    .texte-detail-sm {
      margin: 8px 0 0;

      :global(p) {
        margin: 0;
      }
    }
  }
</style>
