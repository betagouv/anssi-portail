<script lang="ts">
  import FilAriane from './FilAriane.svelte';

  export let titre: string;
  export let description: string;
  export let ariane: string;
</script>

<section class="chapeau fond-sombre">
  <div class="contenu-section">
    <FilAriane feuille={ariane} />
    <h1>{titre}</h1>
    <p>{description}</p>
  </div>
</section>
