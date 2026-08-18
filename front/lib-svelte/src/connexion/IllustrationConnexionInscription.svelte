<script lang="ts">
  import IllustrationAnimee from '../accueil/animation/IllustrationAnimee.svelte';
  import ConnexionInscription from './animation/ConnexionInscription.svelte';

  const scènes = [ConnexionInscription];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Deux collègues consultent MesServicesCyber sur un ordinateur portable. Bon réflexe : garder la maîtrise de son environnement numérique."
/>
