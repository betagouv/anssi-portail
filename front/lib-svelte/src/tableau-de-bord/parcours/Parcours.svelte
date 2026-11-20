<script lang="ts">
  import { profilStore } from '../../stores/profil.store';
  import EncartPrésentationParcours from './EncartPresentationParcours.svelte';
</script>

{#if !$profilStore?.parcoursSecurisation?.parcoursActuel}
  <div>
    <p class="texte-chapo-xl">
      Sélectionnez le parcours adapté à votre organisation et commencez dès maintenant à renforcer votre cybersécurité.
    </p>
    <EncartPrésentationParcours />
  </div>
{/if}
