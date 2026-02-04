<script lang="ts">
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags
  titre="Protéger ma collectivité contre les cyberattaques"
  description="Les collectivités sont exposées aux cyberattaques, notamment aux rançongiciels. En 2024, elles ont représenté 17 % des cibles de rançongiciels, ce qui en fait le deuxième type d’entités le plus visé."
  cacheActions
  illustrationSource="/assets/images/image-generique.avif"
  illustrationAlt=""
  cacheIllustration={false}
>
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Protéger ma collectivité" />
  {/snippet}
</Heros>
