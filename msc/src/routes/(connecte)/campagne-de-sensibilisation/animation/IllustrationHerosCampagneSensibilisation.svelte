<script lang="ts">
  import IllustrationAnimee from '$msc/accueil/animation/IllustrationAnimee.svelte';
  import SceneHerosKitSensibilisation from './SceneHerosCampagneSensibilisation.svelte';

  const scènes = [SceneHerosKitSensibilisation];
</script>

<IllustrationAnimee
  {scènes}
  étiquette="Une personne accroche une affiche de sensibilisation aux mots de passe dans un espace de travail."
/>
