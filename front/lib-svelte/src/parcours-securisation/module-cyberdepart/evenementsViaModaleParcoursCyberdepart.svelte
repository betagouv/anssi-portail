<script lang="ts">
  import ModaleRetourUtilisateurSurParcours from '../ModaleRetourUtilisateurSurParcours.svelte';
  import ModaleBadgeCyberdepartDebloque from './ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleModuleCyberdepartTermine from './ModaleModuleCyberdepartTermine.svelte';

  type Props = { peutOuvrir: boolean };
  let { peutOuvrir }: Props = $props();
  let modaleRetourMiParcoursOuverte = $state(false);
  let modaleParcoursCyberdépartTerminéOuverte = $state(false);
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);
  $effect(() => {
    if (!peutOuvrir) return;
    if (sessionStorage.getItem('badge-cyberdepart-debloque') === 'true') {
      badgeCyberdépartDebloqué = true;
      sessionStorage.removeItem('badge-cyberdepart-debloque');
    }
    if (sessionStorage.getItem('module-termine') === 'true') {
      moduleTerminé = true;
      sessionStorage.removeItem('module-termine');
    }
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
