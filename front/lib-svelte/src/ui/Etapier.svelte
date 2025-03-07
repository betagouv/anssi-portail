<script lang="ts">
    export let etapeCourante: number;
    export let nombreEtapes: number;
</script>

<div class="etapier">
    {#each new Array(nombreEtapes).fill(0) as _, i}
        <span class:accessible={i <= etapeCourante} />
    {/each}
</div>
