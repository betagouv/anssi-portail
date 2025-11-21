<script lang="ts">
  import { aseptiseHtml } from '../utils/aseptisationDuHtml';

  export let ancre: string;
  export let titre: string;
  export let detail: string;

  const detailPurifie = aseptiseHtml(detail);
</script>

{#if detail}
  <section>
    <div class="contenu-section">
      <h2 id={ancre}>{titre}</h2>
      <!-- On affiche des données provenant d'une source interne -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html detailPurifie}
    </div>
  </section>
{/if}

<style lang="scss">
  section {
    :global(a) {
      display: inline;
      text-decoration: underline;
      -webkit-text-decoration: underline;

      &:after {
        display: none;
      }
    }
  }
</style>
