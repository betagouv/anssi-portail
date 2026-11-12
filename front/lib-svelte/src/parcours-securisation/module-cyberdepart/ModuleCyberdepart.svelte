<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../../stores/profil.store';
  import Alerte from '../../ui/Alerte.svelte';
  import BadgeBêta from '../../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Héros from '../../ui/Heros.svelte';
  import { toasterStore } from '../../ui/toasts/toaster.store';
  import Toaster from '../../ui/toasts/Toaster.svelte';
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import InterlocuteursParcoursSecurisation from '../InterlocuteursParcoursSecurisation.svelte';
  import LienRetourAuxModules from '../LienRetourAuxModules.svelte';
  import MesuresDeModule from '../MesuresDeModule.svelte';
  import type { ModuleRéponseApi } from '../moduleReponseApi';
  import Progression from '../Progression.svelte';
  import RetourUtilisateurSurParcours from '../RetourUtilisateurSurParcours.svelte';
  import BadgeCyberdépart from './BadgeCyberdepart.svelte';
  import BasculeParcoursComplet from './BasculeParcoursComplet.svelte';
  import ÉvènementsViaModaleParcoursComplet from './evenementsViaModaleParcoursComplet.svelte';
  import ÉvènementsViaModaleParcoursCyberdepart from './evenementsViaModaleParcoursCyberdepart.svelte';

  let module = $state<ModuleRéponseApi | undefined>(undefined);
  const totalMesures = $derived(module?.mesures.length ?? 0);
  let animeProgression = $state(false);

  onMount(async () => {
    const réponse = await axios.get<ModuleRéponseApi>(`/api/modules/1`);
    module = réponse.data;
    évènementsDuParcours.traiteMesurePriseEnCompte(() => {
      toasterStore.succes('Mesure déclarée prise en compte', 'Votre progression a été mise à jour.');
      animeProgression = true;
    });
  });

  const progressionActuelle = $derived(module?.mesures.filter((module) => module.estPriseEnCompte).length ?? 0);
  const badgeDebloqué = $derived(totalMesures > 0 && progressionActuelle >= (module?.cibleBadge ?? 0));
  const parcoursTerminé = $derived(totalMesures > 0 && progressionActuelle === totalMesures);
  const parcoursCyberDépart = $derived($profilStore?.parcoursSecurisation.parcoursActuel === 'allégé');
  const parcoursComplet = $derived($profilStore?.parcoursSecurisation.parcoursActuel === 'complet');
  const propriétésFilAriane: PropriétésFilAriane = $derived(
    parcoursComplet
      ? [
          {
            nom: 'Protéger mon organisation',
            lien: '/parcours-complet',
          },
          {
            nom: module?.nom ?? '',
          },
        ]
      : [
          {
            nom: 'Protéger mon organisation',
          },
        ]
  );
</script>

<Toaster />
<Héros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description={module?.description ?? ''}
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre={module?.nom ?? ''}
  theme="pastel"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
>
  {#snippet tags()}
    <BadgeBêta />
  {/snippet}
</Héros>

{#if parcoursCyberDépart}
  <ÉvènementsViaModaleParcoursCyberdepart peutOuvrir={!!module} />
{:else if parcoursComplet}
  <ÉvènementsViaModaleParcoursComplet peutOuvrir={!!module} />
{/if}

<dsfr-container>
  <div class="progression">
    <LienRetourAuxModules />
    {#if parcoursTerminé && !parcoursComplet}
      <BasculeParcoursComplet />
    {:else if badgeDebloqué && !parcoursTerminé}
      <Alerte type="information" taille="md" titre="">
        Complétez votre progression et accédez à des mesures plus avancées pour renforcer vos pratiques, mieux
        structurer vos actions et améliorer votre protection dans la durée.
      </Alerte>
    {/if}
    {#if module}
      <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge} anime={animeProgression}
      ></Progression>
    {/if}
    {#if badgeDebloqué}
      <BadgeCyberdépart />
    {/if}
  </div>
</dsfr-container>
<RetourUtilisateurSurParcours />

<MesuresDeModule mesures={module?.mesures ?? []} />
<InterlocuteursParcoursSecurisation />

<style lang="scss">
  .progression {
    padding-block: 2rem;
    gap: 1.5rem;
    display: flex;
    flex-direction: column;
  }
</style>
