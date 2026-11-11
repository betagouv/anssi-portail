<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import ModaleRetourUtilisateurSurParcours from './ModaleRetourUtilisateurSurParcours.svelte';

  type Props = { peutOuvrir: boolean };
  let { peutOuvrir }: Props = $props();
  let modaleRetourMiParcoursOuverte = $state(false);
  $effect(() => {
    if (!peutOuvrir || $profilStore?.parcoursSecurisation.parcoursActuel !== 'complet') return;
    if (sessionStorage.getItem('10-mesures-prises-en-compte') !== 'true') return;
    sessionStorage.removeItem('10-mesures-prises-en-compte');
    modaleRetourMiParcoursOuverte = true;
  });
</script>

<ModaleRetourUtilisateurSurParcours bind:estOuverte={modaleRetourMiParcoursOuverte} typeDeRetour="mi-parcours" />
