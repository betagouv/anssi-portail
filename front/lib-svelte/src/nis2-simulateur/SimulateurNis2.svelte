<script lang="ts">
  import { questionnaireStore } from './stores/questionnaire.store';
  import {
    valideActivites,
    valideEtapeAppartenanceUE,
    valideEtapeDesignation,
    valideEtapePrealable,
    valideLocalisationEtablissementPrincipal,
    valideSecteursActivite,
    valideSousSecteursActivite,
    valideTailleEntitePrivee,
    valideTypeStructure,
  } from './stores/actions';
  import EtapePrealable from './etapes/EtapePrealable.svelte';
  import Hero from '../ui/Hero.svelte';
  import EtapeDesignation from './etapes/EtapeDesignation.svelte';
  import EtapeAppartenanceUE from './etapes/EtapeAppartenanceUE.svelte';
  import EtapeTypeStructure from './etapes/EtapeTypeStructure.svelte';
  import EtapeTailleEntitePrivee from './etapes/EtapeTailleEntitePrivee.svelte';
  import EtapeSecteursActivite from './etapes/EtapeSecteursActivite.svelte';
  import EtapeSousSecteursActivite from './etapes/EtapeSousSecteursActivite.svelte';
  import { estUnSecteurAvecDesSousSecteurs } from './stores/SecteurActivite.predicats';
  import EtapeActivites from './etapes/EtapeActivites.svelte';
  import { selectSecteursPourSaisieActivites } from './stores/questionnaire.selecteurs.ts';
  import EtapeLocalisationEtablissementPrincipal from './etapes/EtapeLocalisationEtablissementPrincipal.svelte';
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
  {:else if $questionnaireStore.etapeCourante === 'typeStructure'}
    <EtapeTypeStructure
      onsuivant={(reponse) =>
        questionnaireStore.repond(valideTypeStructure([reponse]))}
    />
  {:else if $questionnaireStore.etapeCourante === 'tailleEntitePrivee'}
    <EtapeTailleEntitePrivee
      onsuivant={(reponse) =>
        questionnaireStore.repond(
          valideTailleEntitePrivee(
            [reponse.nombre],
            [reponse.chiffreAffaire],
            [reponse.bilanFinancier]
          )
        )}
    />
  {:else if $questionnaireStore.etapeCourante === 'secteursActivite'}
    <EtapeSecteursActivite
      onsuivant={(reponse) =>
        questionnaireStore.repond(valideSecteursActivite(reponse))}
    />
  {:else if $questionnaireStore.etapeCourante === 'sousSecteursActivite'}
    <EtapeSousSecteursActivite
      secteursChoisis={$questionnaireStore.secteurActivite.filter((s) =>
        estUnSecteurAvecDesSousSecteurs(s)
      )}
      onsuivant={(reponse) =>
        questionnaireStore.repond(valideSousSecteursActivite(reponse))}
    />
  {:else if $questionnaireStore.etapeCourante === 'activites'}
    <EtapeActivites
      secteursChoisis={selectSecteursPourSaisieActivites($questionnaireStore)}
      onsuivant={(reponse) =>
        questionnaireStore.repond(valideActivites(reponse))}
    />
  {:else if $questionnaireStore.etapeCourante === 'localisationEtablissementPrincipal'}
    <EtapeLocalisationEtablissementPrincipal
      onsuivant={(reponse) =>
        questionnaireStore.repond(
          valideLocalisationEtablissementPrincipal(
            [reponse.paysDecision],
            [reponse.paysOperation],
            [reponse.paysSalaries]
          )
        )}
    />
  {/if}
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 20px;
  }
</style>
