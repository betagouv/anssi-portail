<script lang="ts">
  export let ancre: string;
  export let titre: string;
  export let detail: string;
</script>

{#if detail}
  <section id={ancre}>
    <div class="contenu-section">
      <h2>{titre}</h2>
      <div>{@html detail}</div>
    </div>
  </section>
{/if}

<style lang="scss">
  section {
    padding: 0 var(--gouttiere) 40px;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
