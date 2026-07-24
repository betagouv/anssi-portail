<script lang="ts">
  import { onMount } from 'svelte';
  import Heros from '../../ui/Heros.svelte';
  import axios from 'axios';
  import type { Mesure, Module } from '../mesure';
  import Progression from '../Progression.svelte';
  import ControleSegmente from '../../navigation/ControleSegmente.svelte';
  import { creeLeFragmentDeNavigation } from '../../navigation/fragmentDeNavigation.svelte';
  import VueModule from './VueModule.svelte';
  import VueListeMesures from './VueListeMesures.svelte';

  type ModulePrésentation = {
    id: number;
    titre: string;
    description: string;
    cibleBadge?: number;
    nombreMesuresTotal: number;
    nombreMesuresPrisesEnCompte: number;
    mesures: Mesure[];
  };

  let modules: ModulePrésentation[] = $state([]);

  onMount(async () => {
    const réponse = await axios.get<{ modules: Module[] }>('/api/parcours/complet');
    modules = réponse.data.modules.map((module) => ({
      ...module,
      titre: module.nom,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue.',
    }));
  });

  const totalMesures = $derived(modules.reduce((total, { nombreMesuresTotal }) => (total += nombreMesuresTotal), 0));
  const totalMesuresPrisesEnCompte = $derived(
    modules.reduce((total, { nombreMesuresPrisesEnCompte }) => (total += nombreMesuresPrisesEnCompte), 0)
  );

  let fragmentDeNavigation = creeLeFragmentDeNavigation();

  let vueCourante = $derived(fragmentDeNavigation.section);
</script>

<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus nibh, faucibus sed elit quis, aliquet malesuada augue."
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre="Parcours de sécurisation"
  theme="sombre"
></Heros>
<dsfr-container>
  <div class="progression-totale">
    <Progression actuel={totalMesuresPrisesEnCompte} max={totalMesures} />
  </div>
</dsfr-container>
<dsfr-container>
  <div class="conteneur-controle-segmente">
    <ControleSegmente
      elements={[
        { id: 'modules', titre: 'Modules', icone: 'layout-grid-line', ancre: 'modules' },
        { id: 'mesures', titre: 'Liste', icone: 'list-check', ancre: 'mesures' },
      ]}
      bind:idÉlémentSélectionné={vueCourante}
      {fragmentDeNavigation}
    ></ControleSegmente>
  </div>
</dsfr-container>
<dsfr-container>
  {#if vueCourante === 'mesures'}
    <VueListeMesures {modules} />
  {:else}
    <VueModule {modules} />
  {/if}
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .progression-totale {
    padding-block: 2rem;
  }

  .conteneur-controle-segmente {
    background: var(--background-default-grey);
    margin-bottom: 2rem;
    display: flex;
    place-items: 'flex-start';
  }
</style>
