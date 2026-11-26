<script lang="ts">
  import { get } from 'svelte/store';
  import Badge from '../ui/Badge.svelte';
  import { profilStore } from '@stores/profil.store';
</script>

{#if $profilStore && profilStore.utilisateurEstConnecte() && get(profilStore)?.estAgentAnssi}
  <Badge libellé="Agent ANSSI" accent="blue-ecume" taille="sm" />
{/if}
