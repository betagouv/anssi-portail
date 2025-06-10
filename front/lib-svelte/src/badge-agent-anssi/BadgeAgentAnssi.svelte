<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import { get } from 'svelte/store';
</script>

{#if $profilStore && profilStore.utilisateurEstConnecte() && get(profilStore)?.estAgentAnssi}
  <span class="badge-agent-anssi">Agent ANSSI</span>
{/if}

<style lang="scss">
  .badge-agent-anssi {
    text-transform: uppercase;
    padding: 0 6px;
    border-radius: 4px;
    color: #2f4077ff;
    font-weight: bold;
    font-size: 0.8rem;
    background-color: #e9edfeff;
    text-wrap: nowrap;
  }
</style>