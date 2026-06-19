<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import { toasterStore } from '../ui/toasts/toaster.store';
  import Toaster from '../ui/toasts/Toaster.svelte';
  import BadgeCyberdepart from './BadgeCyberdepart.svelte';
  import BasculeParcoursAvance from './BasculeParcoursAvance.svelte';
  import GrilleCartesMesures from './GrilleCartesMesures.svelte';
  import type { Mesure } from './mesure';
  import Progression from './Progression.svelte';

  let mesures: Mesure[] = $state([]);
  const totalMesures = $derived(mesures.length);
  const cibleBadge = $derived(Math.floor(mesures.length * 0.8));

  onMount(async () => {
    const reponse = await axios.get<{ mesures: Mesure[] }>(`/api/modules/1`);
    mesures = reponse.data.mesures;
    if (sessionStorage.getItem('mesure-prise-en-compte') === 'true') {
      toasterStore.succes('Mesure déclarée prise en compte', 'Mesure déclarée prise en compte');
      sessionStorage.removeItem('mesure-prise-en-compte');
    }
  });
  const mesuresMisesEnAvant = $derived(mesures.filter((_, index) => index < 4));
  const autresMesures = $derived(mesures.filter((_, index) => index >= 4));
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

<dsfr-container class="actions-en-avant">
  <h4>🚀 Lancez-vous avec ces premières actions</h4>
  <GrilleCartesMesures mesures={mesuresMisesEnAvant}></GrilleCartesMesures>
</dsfr-container>

<dsfr-container class="autres-actions">
  <GrilleCartesMesures mesures={autresMesures}></GrilleCartesMesures>
</dsfr-container>

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  dsfr-container.actions-en-avant {
    background-color: var(--background-alt-blue-france);
    padding-block: 3rem;

    h4 {
      margin-bottom: 2rem;
    }
  }

  .autres-actions {
    padding-block: 3rem;
  }
</style>
