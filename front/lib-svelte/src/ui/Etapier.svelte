<script lang="ts">
  export let etapeCourante: number;
  export let nombreEtapes: number;
</script>

<div class="etapier">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#each new Array(nombreEtapes).fill(0) as _, i (i)}
    <span class:accessible={i <= etapeCourante}></span>
  {/each}
</div>
