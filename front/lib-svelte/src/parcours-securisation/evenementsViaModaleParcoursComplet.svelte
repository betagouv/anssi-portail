<script lang="ts">
  import { évènementsDuParcours } from './evenementsDuParcours';
  import ModaleRetourUtilisateurSurParcours from './ModaleRetourUtilisateurSurParcours.svelte';
  import ModaleParcoursTermine from './module/ModaleParcoursTermine.svelte';

  type Props = { peutOuvrir: boolean };
  let { peutOuvrir }: Props = $props();
  let modaleRetourMiParcoursOuverte = $state(false);
  let modaleRetourParcoursTerminéOuverte = $state(false);
  let modaleParcoursCompletTerminéOuverte = $state(false);

  $effect(() => {
    if (!peutOuvrir) return;
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
