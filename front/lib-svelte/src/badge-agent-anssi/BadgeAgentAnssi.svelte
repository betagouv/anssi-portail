<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import { get } from 'svelte/store';
</script>

{#if $profilStore && profilStore.utilisateurEstConnecte() && get(profilStore)?.estAgentAnssi}
  <span class="badge-agent-anssi">Agent ANSSI</span>
{/if}
