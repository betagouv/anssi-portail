<script lang="ts">
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import ModaleBadgeCyberdepartDebloque from '../ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleRetourUtilisateurSurParcours from '../ModaleRetourUtilisateurSurParcours.svelte';
  import ModaleModuleCyberdepartTermine from './ModaleModuleCyberdepartTermine.svelte';

  type Props = { peutOuvrir: boolean; estOuverte?: boolean };
  let { peutOuvrir, estOuverte = $bindable(false) }: Props = $props();
  let modaleRetourMiParcoursOuverte = $state(false);
  let modaleParcoursCyberdépartTerminéOuverte = $state(false);
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);
  $effect(() => {
    estOuverte =
      badgeCyberdépartDebloqué ||
      moduleTerminé ||
      modaleRetourMiParcoursOuverte ||
      modaleParcoursCyberdépartTerminéOuverte;
  });
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

<ModaleBadgeCyberdepartDebloque
  bind:estOuverte={badgeCyberdépartDebloqué}
  surFermeture={() => {
    modaleRetourMiParcoursOuverte = true;
  }}
/>
<ModaleRetourUtilisateurSurParcours bind:estOuverte={modaleRetourMiParcoursOuverte} typeDeRetour="mi-parcours" />

<ModaleModuleCyberdepartTermine bind:estOuverte={modaleParcoursCyberdépartTerminéOuverte} />
<ModaleRetourUtilisateurSurParcours
  bind:estOuverte={moduleTerminé}
  typeDeRetour="parcours terminé"
  surFermeture={() => {
    modaleParcoursCyberdépartTerminéOuverte = true;
  }}
/>
