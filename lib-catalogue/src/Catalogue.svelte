<script lang="ts">
    import type {Service} from "./Catalogue.types";

    export let services: Service[]
</script>

<main>
    Catalogue des services :
    <ul>
        {#each services as service}
            <li>{service.nom}</li>
        {/each}
    </ul>
</main>

<style>
    main {
        margin: 0;
    }
</style>