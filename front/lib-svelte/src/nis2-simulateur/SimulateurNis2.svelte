<script lang="ts">
  import { questionnaireStore } from './stores/questionnaire.store';
  import {
    valideEtapeAppartenanceUE,
    valideEtapeDesignation,
    valideEtapePrealable,
  } from './stores/actions';
  import EtapePrealable from './etapes/EtapePrealable.svelte';
  import Hero from '../ui/Hero.svelte';
  import EtapeDesignation from './etapes/EtapeDesignation.svelte';
  import EtapeAppartenanceUE from './etapes/EtapeAppartenanceUE.svelte';
</script>

<Hero
  titre="Mon entité est-elle concernée&nbsp;?"
  description="Déterminez si votre entité est régulée par la directive NIS&nbsp;2."
  arianeBranche={{ nom: 'Directive NIS 2', lien: '/nis2' }}
  ariane="Simulateur"
/>

<dsfr-container>
  {#if $questionnaireStore.etapeCourante === 'prealable'}
    <EtapePrealable
      onsuivant={() => questionnaireStore.repond(valideEtapePrealable())}
    />
  {:else if $questionnaireStore.etapeCourante === 'designationOperateurServicesEssentiels'}
    <EtapeDesignation
      onsuivant={(reponse) =>
        questionnaireStore.repond(valideEtapeDesignation([reponse]))}
    />
  {:else if $questionnaireStore.etapeCourante === 'appartenanceUnionEuropeenne'}
    <EtapeAppartenanceUE
      onsuivant={(reponse) =>
        questionnaireStore.repond(valideEtapeAppartenanceUE([reponse]))}
    />
  {/if}
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 20px;
  }
</style>
