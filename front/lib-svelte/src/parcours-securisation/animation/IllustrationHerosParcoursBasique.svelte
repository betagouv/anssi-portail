<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import HerosParcoursBasique from './HerosParcoursBasique.svelte';

  const scènes = [HerosParcoursBasique];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Deux personnes suivent le parcours Cyberdépart sur un ordinateur portable pour renforcer la sécurité de leur organisation."
/>
