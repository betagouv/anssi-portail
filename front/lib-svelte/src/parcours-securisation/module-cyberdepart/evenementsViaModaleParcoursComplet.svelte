<script lang="ts">
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import EvenementsViaModaleParcoursComplet from '../evenementsViaModaleParcoursComplet.svelte';
  import ModaleModuleCyberdepartTermine from './ModaleModuleCyberdepartTermine.svelte';
  import ModaleBadgeCyberdepartDebloque from './ModaleBadgeCyberdepartDebloque.svelte';

  type Props = { peutOuvrir: boolean };
  let { peutOuvrir }: Props = $props();
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);
  let événementsTraités = $state(false);
  $effect(() => {
    if (!peutOuvrir) return;
    évènementsDuParcours.traiteBadgeCyberdépartDébloqué(() => {
      badgeCyberdépartDebloqué = true;
    });
    évènementsDuParcours.traiteModuleTerminé(() => {
      moduleTerminé = true;
    });
    événementsTraités = true;
  });
</script>

<ModaleBadgeCyberdepartDebloque bind:estOuverte={badgeCyberdépartDebloqué} />
<ModaleModuleCyberdepartTermine bind:estOuverte={moduleTerminé} />
<EvenementsViaModaleParcoursComplet
  peutOuvrir={peutOuvrir && événementsTraités && !badgeCyberdépartDebloqué && !moduleTerminé}
/>
