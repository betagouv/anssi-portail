<script lang="ts">
  import { get } from 'svelte/store';
  import { profilStore } from '../stores/profil.store';
</script>

{#if $profilStore && profilStore.utilisateurEstConnecte() && get(profilStore)?.estAgentAnssi}
  <dsfr-badge type="accent" accent="blue-ecume" size="sm" label="Agent ANSSI"></dsfr-badge>
{/if}
