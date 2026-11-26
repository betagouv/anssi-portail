<script lang="ts">
  import { profilStore } from '@stores/profil.store';

  import EncartAvancementCyberpdepart from './EncartAvancementCyberpdepart.svelte';
  import EncartAvancementParcoursComplet from './EncartAvancementParcoursComplet.svelte';
  import EncartPrésentationParcours from './EncartPresentationParcours.svelte';
</script>

{#if $profilStore}
  {#if !$profilStore.parcoursSecurisation?.parcoursActuel}
    <div>
      <p class="texte-chapo-xl">
        Sélectionnez le parcours adapté à votre organisation et commencez dès maintenant à renforcer votre
        cybersécurité.
      </p>
      <EncartPrésentationParcours />
    </div>
  {:else if $profilStore.parcoursSecurisation?.parcoursActuel === 'allégé'}
    <EncartAvancementCyberpdepart />
  {:else}
    <EncartAvancementParcoursComplet />
  {/if}
{/if}
