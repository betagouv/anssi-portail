<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import ContrôleSegmenté from '../../navigation/ControleSegmente.svelte';
  import { creeLeFragmentDeNavigation as créeLeFragmentDeNavigation } from '../../navigation/fragmentDeNavigation.svelte';
  import BadgeBêta from '../../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Héros from '../../ui/Heros.svelte';
  import Lien from '../../ui/Lien.svelte';
  import ÉvènementsViaModaleParcoursComplet from '../evenementsViaModaleParcoursComplet.svelte';
  import type { Mesure, Module } from '../mesures/mesure';
  import Progression from '../Progression.svelte';
  import RetourUtilisateurSurParcours from '../RetourUtilisateurSurParcours.svelte';
  import VueListeMesures from './VueListeMesures.svelte';
  import VueModule from './VueModule.svelte';

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
      description: module.description,
    }));
  });

  const totalMesures = $derived(modules.reduce((total, { nombreMesuresTotal }) => (total += nombreMesuresTotal), 0));
  const totalMesuresPrisesEnCompte = $derived(
    modules.reduce((total, { nombreMesuresPrisesEnCompte }) => (total += nombreMesuresPrisesEnCompte), 0)
  );

  let fragmentDeNavigation = créeLeFragmentDeNavigation();

  let vueCourante = $derived(fragmentDeNavigation.section);

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Protéger mon organisation' };
</script>

<Héros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description="6 modules conçus pour protéger votre organisation contre les principaux risques cyber et vous accompagner dans votre mise en conformité avec NIS 2, si vous êtes concerné."
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre="Parcours de sécurisation"
  theme="pastel"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
>
  {#snippet tags()}
    <BadgeBêta />
  {/snippet}
</Héros>
<dsfr-container>
  <div class="progression-totale">
    <Progression actuel={totalMesuresPrisesEnCompte} max={totalMesures} />
  </div>

  <div class="conteneur-controle-segmente">
    <ContrôleSegmenté
      elements={[
        { id: 'modules', titre: 'Modules', icone: 'layout-grid-line', ancre: 'modules' },
        { id: 'mesures', titre: 'Liste des mesures', icone: 'list-check', ancre: 'mesures' },
      ]}
      bind:idÉlémentSélectionné={vueCourante}
      {fragmentDeNavigation}
    ></ContrôleSegmenté>

    {#if vueCourante === 'mesures'}
      <Lien
        apparence="bouton"
        type="secondaire"
        icone="download-line"
        libelle="Exporter la liste"
        href="/api/mesures.csv"
      />
    {/if}
  </div>

  {#if vueCourante === 'mesures'}
    <VueListeMesures {modules} />
  {:else}
    <VueModule {modules} />
  {/if}
</dsfr-container>

<ÉvènementsViaModaleParcoursComplet peutOuvrir={modules.length > 0} />
<RetourUtilisateurSurParcours />

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  .progression-totale {
    padding-block: 2rem;
  }

  .conteneur-controle-segmente {
    background: var(--background-default-grey);
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
  }
</style>
