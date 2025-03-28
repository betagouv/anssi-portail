<script lang="ts">
  import FilAriane from './FilAriane.svelte';

  export let nom: string;
  let branche = {
    nom: 'Les services et ressources cyber',
    lien: '/catalogue',
  };
</script>

<FilAriane feuille={nom} {branche} />
