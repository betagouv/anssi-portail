<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Heros from '../ui/Heros.svelte';
  import GrilleCartesMesures from './GrilleCartesMesures.svelte';
  import type { Mesure } from './mesure';
  import Progression from './Progression.svelte';

  let mesures: Mesure[] = $state([]);

  onMount(async () => {
    const reponse = await axios.get<Mesure[]>(`/api/modules/cyberdepart/mesures`);
    mesures = reponse.data;
  });
  const mesuresMisesEnAvant = $derived(mesures.filter((_, index) => index < 4));
  const autresMesures = $derived(mesures.filter((_, index) => index >= 4));
</script>

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

<dsfr-container class="progression">
  <Progression></Progression>
</dsfr-container>

<dsfr-container class="actions-en-avant">
  <h4>🚀 Lancez-vous avec ces premières actions</h4>
  <GrilleCartesMesures mesures={mesuresMisesEnAvant}></GrilleCartesMesures>
</dsfr-container>

<dsfr-container class="autres-actions">
  <GrilleCartesMesures mesures={autresMesures}></GrilleCartesMesures>
</dsfr-container>

<style lang="scss">
  dsfr-container.progression {
    padding-block: 2rem;
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
