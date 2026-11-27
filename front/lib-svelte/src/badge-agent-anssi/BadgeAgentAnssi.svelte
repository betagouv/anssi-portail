<script lang="ts">
  import { get } from 'svelte/store';

  import { profilStore } from '@stores/profil.store';

  import Badge from '../ui/Badge.svelte';
</script>

{#if $profilStore && profilStore.utilisateurEstConnecte() && get(profilStore)?.estAgentAnssi}
  <Badge libellé="Agent ANSSI" accent="blue-ecume" taille="sm" />
{/if}
