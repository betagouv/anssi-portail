<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import ModaleRetourUtilisateurSurParcours from './ModaleRetourUtilisateurSurParcours.svelte';
  import ModaleParcoursTermine from './module/ModaleParcoursTermine.svelte';

  type Props = { peutOuvrir: boolean; estOuverte?: boolean };
  let { peutOuvrir, estOuverte = $bindable(false) }: Props = $props();
  let modaleRetourMiParcoursOuverte = $state(false);
  let modaleRetourParcoursTerminéOuverte = $state(false);
  let modaleParcoursCompletTerminéOuverte = $state(false);

  $effect(() => {
    estOuverte =
      modaleRetourMiParcoursOuverte || modaleRetourParcoursTerminéOuverte || modaleParcoursCompletTerminéOuverte;
  });

  $effect(() => {
    if (!peutOuvrir || $profilStore?.parcoursSecurisation.parcoursActuel !== 'complet') return;
    if (sessionStorage.getItem('parcours-complet-termine') === 'true') {
      sessionStorage.removeItem('parcours-complet-termine');
      sessionStorage.removeItem('module-termine');
      sessionStorage.removeItem('10-mesures-prises-en-compte');
      modaleParcoursCompletTerminéOuverte = true;
      return;
    }
    if (sessionStorage.getItem('10-mesures-prises-en-compte') !== 'true') return;
    sessionStorage.removeItem('10-mesures-prises-en-compte');
    modaleRetourMiParcoursOuverte = true;
  });
</script>

<ModaleRetourUtilisateurSurParcours bind:estOuverte={modaleRetourMiParcoursOuverte} typeDeRetour="mi-parcours" />

<ModaleParcoursTermine
  bind:estOuverte={modaleParcoursCompletTerminéOuverte}
  surFermeture={() => {
    modaleRetourParcoursTerminéOuverte = true;
  }}
/>
<ModaleRetourUtilisateurSurParcours
  bind:estOuverte={modaleRetourParcoursTerminéOuverte}
  typeDeRetour="parcours terminé"
/>
