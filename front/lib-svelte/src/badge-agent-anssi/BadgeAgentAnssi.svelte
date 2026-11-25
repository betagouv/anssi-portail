<script lang="ts">
  import { utiliseProfil } from '../stores/profil.store';

  const profilStore = utiliseProfil();
</script>

{#if $profilStore?.estAgentAnssi}
  <dsfr-badge type="accent" accent="blue-ecume" size="sm" label="Agent ANSSI"></dsfr-badge>
{/if}
