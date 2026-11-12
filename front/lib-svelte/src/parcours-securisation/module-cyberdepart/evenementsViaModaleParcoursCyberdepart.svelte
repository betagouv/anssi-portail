<script lang="ts">
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import ModaleRetourUtilisateurSurParcours from '../ModaleRetourUtilisateurSurParcours.svelte';
  import ModaleBadgeCyberdépartDebloqué from './ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleModuleCyberdepartTerminé from './ModaleModuleCyberdepartTermine.svelte';

  type Props = { peutOuvrir: boolean };
  let { peutOuvrir }: Props = $props();
  let modaleRetourMiParcoursOuverte = $state(false);
  let modaleParcoursCyberdépartTerminéOuverte = $state(false);
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);
  $effect(() => {
    if (!peutOuvrir) return;
    évènementsDuParcours.traiteBadgeCyberdépartDébloqué(() => {
      badgeCyberdépartDebloqué = true;
    });
    évènementsDuParcours.traiteModuleTerminé(() => {
      moduleTerminé = true;
    });
  });
</script>

<ModaleBadgeCyberdépartDebloqué
  bind:estOuverte={badgeCyberdépartDebloqué}
  surFermeture={() => {
    modaleRetourMiParcoursOuverte = true;
  }}
/>
<ModaleRetourUtilisateurSurParcours bind:estOuverte={modaleRetourMiParcoursOuverte} typeDeRetour="mi-parcours" />

<ModaleModuleCyberdepartTerminé bind:estOuverte={modaleParcoursCyberdépartTerminéOuverte} />
<ModaleRetourUtilisateurSurParcours
  bind:estOuverte={moduleTerminé}
  typeDeRetour="parcours terminé"
  surFermeture={() => {
    modaleParcoursCyberdépartTerminéOuverte = true;
  }}
/>
