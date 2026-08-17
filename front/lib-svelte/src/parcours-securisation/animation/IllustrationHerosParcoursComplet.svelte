<script lang="ts">
  import IllustrationAnimee from '../../accueil/animation/IllustrationAnimee.svelte';
  import HerosParcoursComplet from './HerosParcoursComplet.svelte';

  const scènes = [HerosParcoursComplet];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Une personne parcourt les modules du programme de sécurisation complet sur un ordinateur portable."
/>
