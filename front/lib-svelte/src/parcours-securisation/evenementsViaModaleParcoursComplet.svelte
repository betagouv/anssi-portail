<script lang="ts">
  import { profilStore } from '../stores/profil.store';
  import { évènementsDuParcours } from './evenementsDuParcours';
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
    évènementsDuParcours.traiteParcoursCompletTerminé(() => {
      modaleParcoursCompletTerminéOuverte = true;
    });
    évènementsDuParcours.traiteDixMesuresPrisesEnCompteParcoursComplet(() => {
      modaleRetourMiParcoursOuverte = true;
    });
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
