<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../../stores/profil.store';
  import Alerte from '../../ui/Alerte.svelte';
  import BadgeBeta from '../../ui/BadgeBeta.svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../../ui/filAriane';
  import Heros from '../../ui/Heros.svelte';
  import { toasterStore } from '../../ui/toasts/toaster.store';
  import Toaster from '../../ui/toasts/Toaster.svelte';
  import { évènementsDuParcours } from '../evenementsDuParcours';
  import InterlocuteursParcoursSecurisation from '../InterlocuteursParcoursSecurisation.svelte';
  import LienRetourAuxModules from '../LienRetourAuxModules.svelte';
  import MesuresDeModule from '../MesuresDeModule.svelte';
  import type { ModuleRéponseApi } from '../moduleReponseApi';
  import Progression from '../Progression.svelte';
  import RetourUtilisateurSurParcours from '../RetourUtilisateurSurParcours.svelte';
  import BadgeCyberdepart from './BadgeCyberdepart.svelte';
  import BasculeParcoursComplet from './BasculeParcoursComplet.svelte';
  import EvenementsViaModaleParcoursComplet from './evenementsViaModaleParcoursComplet.svelte';
  import EvenementsViaModaleParcoursCyberdepart from './evenementsViaModaleParcoursCyberdepart.svelte';

  let module = $state<ModuleRéponseApi>({
    nom: '',
    description: '',
    mesures: [],
    cibleBadge: 0,
  });
  const totalMesures = $derived(module.mesures.length);
  let animeProgression = $state(false);

  onMount(async () => {
    const reponse = await axios.get<ModuleRéponseApi>(`/api/modules/1`);
    module = reponse.data;
    évènementsDuParcours.traiteMesurePriseEnCompte(() => {
      toasterStore.succes('Mesure déclarée prise en compte', 'Votre progression a été mise à jour.');
      animeProgression = true;
    });
  });

  const progressionActuelle = $derived(module.mesures.filter((module) => module.estPriseEnCompte).length);
  const badgeDebloque = $derived(totalMesures > 0 && progressionActuelle >= (module.cibleBadge ?? 0));
  const parcoursTermine = $derived(totalMesures > 0 && progressionActuelle === totalMesures);
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
            nom: module.nom,
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
<Heros
  cacheActions={true}
  cacheIllustration={true}
  cacheTags={true}
  description={module.description}
  format="banniere"
  illustrationAlt=""
  illustrationSource=""
  titre={module.nom}
  theme="pastel"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
>
  {#snippet tags()}
    <BadgeBeta />
  {/snippet}
</Heros>

{#if parcoursCyberDépart}
  <EvenementsViaModaleParcoursCyberdepart peutOuvrir={module.nom !== ''} />
{:else if parcoursComplet}
  <EvenementsViaModaleParcoursComplet peutOuvrir={module.nom !== ''} />
{/if}

<dsfr-container>
  <div class="progression">
    <LienRetourAuxModules />
    {#if parcoursTermine && !parcoursComplet}
      <BasculeParcoursComplet />
    {:else if badgeDebloque && !parcoursTermine}
      <Alerte type="information" taille="md" titre="">
        Complétez votre progression et accédez à des mesures plus avancées pour renforcer vos pratiques, mieux
        structurer vos actions et améliorer votre protection dans la durée.
      </Alerte>
    {/if}
    {#if module.nom !== ''}
      <Progression actuel={progressionActuelle} max={totalMesures} cible={module.cibleBadge} anime={animeProgression}
      ></Progression>
    {/if}
    {#if badgeDebloque}
      <BadgeCyberdepart />
    {/if}
  </div>
</dsfr-container>
<RetourUtilisateurSurParcours />

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
