<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import BadgeCyberdepart from './BadgeCyberdepart.svelte';
  import BasculeParcoursAvance from './BasculeParcoursAvance.svelte';
  import type { Mesure } from './mesure';
  import MesuresDeModule from './MesuresDeModule.svelte';
  import ModaleBadgeCyberdepartDebloque from './modales/ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleModuleCyberdepartTermine from './modales/ModaleModuleCyberdepartTermine.svelte';
  import Progression from './Progression.svelte';

  let mesures: Mesure[] = $state([]);
  const totalMesures = $derived(mesures.length);
  let cibleBadge = $state(0);
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);

  onMount(async () => {
    const reponse = await axios.get<{ cibleBadge: number; mesures: Mesure[] }>(`/api/modules/1`);
    mesures = reponse.data.mesures;
    cibleBadge = reponse.data.cibleBadge;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Mesure déclarée prise en compte');
      sessionStorage.removeItem('mesure-prise-en-compte');
    }
    if (sessionStorage.getItem('badge-cyberdepart-debloque') === 'true') {
      badgeCyberdépartDebloqué = true;
      sessionStorage.removeItem('badge-cyberdepart-debloque');
    }
    if (sessionStorage.getItem('module-termine') === 'true') {
      moduleTerminé = true;
      sessionStorage.removeItem('module-termine');
    }
  });

  const progressionActuelle = $derived(mesures.filter((m) => m.estPriseEnCompte).length);
  const badgeDebloque = $derived(progressionActuelle >= cibleBadge);
  const parcoursTermine = $derived(progressionActuelle === totalMesures);
</script>

<Toaster />
<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Avancez à votre rythme dans une première démarche de sécurisation et appliquez les recommandations essentielles pour réduire les risques cyber du quotidien."
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre="Cyberdépart : agir pour votre cybersécurité"
  theme="sombre"
></Heros>

<ModaleBadgeCyberdepartDebloque bind:estOuverte={badgeCyberdépartDebloqué} />

<ModaleModuleCyberdepartTermine bind:estOuverte={moduleTerminé} />

<dsfr-container>
  <div class="progression">
    {#if parcoursTermine}
      <BasculeParcoursAvance />
    {:else if badgeDebloque}
      <dsfr-alert
        type="info"
        has-description={true}
        text="Complétez votre progression et accéder à des mesures plus avancées pour renforcer vos pratiques, mieux structurer vos actions et améliorer votre protection dans la durée."
      ></dsfr-alert>
    {/if}
    <Progression actuel={progressionActuelle} max={totalMesures} cible={cibleBadge}></Progression>
    {#if badgeDebloque}
      <BadgeCyberdepart />
    {/if}
  </div>
</dsfr-container>

<MesuresDeModule {mesures} />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
