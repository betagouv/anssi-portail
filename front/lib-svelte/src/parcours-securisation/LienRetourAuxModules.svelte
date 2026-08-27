<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import Lien from '../ui/Lien.svelte';
</script>

{#if $profilStore?.parcoursSecurisation.parcoursActuel === 'complet'}
  <Lien href="/parcours-complet" libelle="Revenir aux modules" icone="arrow-go-back-line"></Lien>
{/if}
