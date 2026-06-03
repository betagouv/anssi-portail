<script lang="ts">
  import Heros from '../ui/Heros.svelte';
  import Progression from './Progression.svelte';
</script>

<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Avancez à votre rythme dans une première démarche de sécurisation et appliquez les recommandations essentielles pour réduire les risques cyber du quotidien."
  format="details"
  illustrationAlt=""
  illustrationSource=""
  titre="Cyberdépart : agir pour votre cybersécurité"
  theme="sombre"
></Heros>

<dsfr-container class="progression">
  <Progression></Progression>
</dsfr-container>

<style lang="scss">
  dsfr-container.progression {
    margin-block: 2rem;
  }
</style>
