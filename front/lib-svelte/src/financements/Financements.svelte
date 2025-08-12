<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import { profilStore } from '../stores/profil.store';
</script>

<Hero
  titre="Financements cyber"
  description="Bénéficiez d’aides et de subventions pour renforcer la maturité cyber de votre organisation."
  ariane={$profilStore ? undefined : 'Financements cyber'}
/>
