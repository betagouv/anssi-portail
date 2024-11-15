<script lang="ts">
    export let services: string[]
</script>

<main>
    Catalogue des services :
    <ul>
        {#each services as service}
            <li>{service}</li>
        {/each}
    </ul>
</main>

<style>
    main {
        margin: 0;
    }
</style>