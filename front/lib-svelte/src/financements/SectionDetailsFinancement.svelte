<script lang="ts">
  import DOMPurify from 'dompurify';

  export let ancre: string;
  export let titre: string;
  export let detail: string;

  const detailPurifie = DOMPurify.sanitize(detail, {
    ALLOWED_TAGS: ['a', 'b', 'br', 'em', 'i', 'li', 'ol', 'p', 'strong', 'ul'],
  });
</script>

{#if detail}
  <section id={ancre}>
    <div class="contenu-section">
      <h2 id={ancre}>{titre}</h2>
      <!-- On affiche des données provenant d'une source interne -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html detailPurifie}
    </div>
  </section>
{/if}

<style lang="scss">
  section :global a {
    display: inline-flex;
    text-decoration: underline;
  }
  section {
    :global(a) {
      display: inline;
      text-decoration: underline;

      &:after {
        display: none;
      }
    }
  }
</style>
