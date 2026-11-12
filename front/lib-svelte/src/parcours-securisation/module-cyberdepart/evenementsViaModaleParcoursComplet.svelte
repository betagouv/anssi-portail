<script lang="ts">
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import ÉvènementsViaModaleParcoursComplet from '../evenementsViaModaleParcoursComplet.svelte';
  import ModaleBadgeCyberdepartDebloqué from './ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleModuleCyberdepartTerminé from './ModaleModuleCyberdepartTermine.svelte';

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

<ModaleBadgeCyberdepartDebloqué bind:estOuverte={badgeCyberdépartDebloqué} />
<ModaleModuleCyberdepartTerminé bind:estOuverte={moduleTerminé} />
<ÉvènementsViaModaleParcoursComplet
  peutOuvrir={peutOuvrir && événementsTraités && !badgeCyberdépartDebloqué && !moduleTerminé}
/>
