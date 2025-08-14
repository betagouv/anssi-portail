<script lang="ts">
  export let ancre: string;
  export let titre: string;
  export let detail: string;
</script>

{#if detail}
  <section id={ancre}>
    <div class="contenu-section">
      <h2>{titre}</h2>
      <!-- On affiche des données provenant d'une source interne -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div>{@html detail}</div>
    </div>
  </section>
{/if}

<style lang="scss">
  section {
    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
