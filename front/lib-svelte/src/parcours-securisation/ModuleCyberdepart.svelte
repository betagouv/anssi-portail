<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import BadgeCyberdepart from './BadgeCyberdepart.svelte';
  import BasculeParcoursComplet from './BasculeParcoursComplet.svelte';
  import MesuresDeModule from './MesuresDeModule.svelte';
  import ModaleBadgeCyberdepartDebloque from './modales/ModaleBadgeCyberdepartDebloque.svelte';
  import ModaleModuleCyberdepartTermine from './modales/ModaleModuleCyberdepartTermine.svelte';
  import Progression from './Progression.svelte';
  import InterlocuteursParcoursSecurisation from './InterlocuteursParcoursSecurisation.svelte';
  import { profilStore } from '../stores/profil.store';
  import type { ModuleRéponseApi } from './moduleReponseApi';
  import BadgeBeta from '../ui/BadgeBeta.svelte';

  let module = $state<ModuleRéponseApi>({
    nom: '',
    description: '',
    mesures: [],
    cibleBadge: 0,
  });
  const totalMesures = $derived(module.mesures.length);
  let badgeCyberdépartDebloqué = $state(false);
  let moduleTerminé = $state(false);

  onMount(async () => {
    const reponse = await axios.get<ModuleRéponseApi>(`/api/modules/1`);
    module = reponse.data;
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

  const progressionActuelle = $derived(module.mesures.filter((module) => module.estPriseEnCompte).length);
  const badgeDebloque = $derived(totalMesures > 0 && progressionActuelle >= (module.cibleBadge ?? 0));
  const parcoursTermine = $derived(totalMesures > 0 && progressionActuelle === totalMesures);
  const parcoursComplet = $derived($profilStore?.parcoursSecurisation.parcoursActuel === 'complet');
</script>

<Toaster />
<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description={module.description}
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre={module.nom}
  theme="sombre"
>
  {#snippet tags()}
    <BadgeBeta />
  {/snippet}
</Heros>

<ModaleBadgeCyberdepartDebloque bind:estOuverte={badgeCyberdépartDebloqué} />

<ModaleModuleCyberdepartTermine bind:estOuverte={moduleTerminé} />

<dsfr-container>
  <div class="progression">
    {#if parcoursTermine && !parcoursComplet}
      <BasculeParcoursComplet />
    {:else if badgeDebloque && !parcoursTermine}
      <dsfr-alert
        type="info"
        has-description={true}
        text="Complétez votre progression et accéder à des mesures plus avancées pour renforcer vos pratiques, mieux structurer vos actions et améliorer votre protection dans la durée."
      ></dsfr-alert>
    {/if}
    <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge}></Progression>
    {#if badgeDebloque}
      <BadgeCyberdepart />
    {/if}
  </div>
</dsfr-container>

<MesuresDeModule mesures={module.mesures} />
<InterlocuteursParcoursSecurisation />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
