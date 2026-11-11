<script lang="ts">
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
    if (sessionStorage.getItem('badge-cyberdepart-debloque') === 'true') {
      sessionStorage.removeItem('badge-cyberdepart-debloque');
      badgeCyberdépartDebloqué = true;
    }
    if (sessionStorage.getItem('parcours-complet-termine') === 'true') {
      sessionStorage.removeItem('module-termine');
    } else if (sessionStorage.getItem('module-termine') === 'true') {
      sessionStorage.removeItem('module-termine');
      moduleTerminé = true;
    }
    événementsTraités = true;
  });
</script>

<ModaleBadgeCyberdepartDebloque bind:estOuverte={badgeCyberdépartDebloqué} />
<ModaleModuleCyberdepartTermine bind:estOuverte={moduleTerminé} />
<EvenementsViaModaleParcoursComplet
  peutOuvrir={peutOuvrir && événementsTraités && !badgeCyberdépartDebloqué && !moduleTerminé}
/>
