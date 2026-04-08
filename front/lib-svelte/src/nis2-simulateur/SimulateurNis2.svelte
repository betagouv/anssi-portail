<script lang="ts">
  import { questionnaireStore } from './stores/questionnaire.store';
  import {
    valideActivites,
    valideEtapeAppartenanceUE,
    valideEtapeDesignation,
    valideEtapePrealable,
    valideLocalisationEtablissementPrincipal,
    valideLocalisationServicesNumeriques,
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
  import EtapeLocalisationServicesNumeriques from './etapes/EtapeLocalisationServicesNumeriques.svelte';
  import EtapeResultat from './resultat/EtapeResultat.svelte';
  import { questionnaireAvecUndo } from './stores/questionnaireAvecUndo.store';
</script>

<Hero
  titre="Mon entité est-elle concernée&nbsp;?"
  description="Déterminez si votre entité est régulée par la directive NIS&nbsp;2."
  arianeBranche={{ nom: 'Directive NIS 2', lien: '/nis2' }}
  ariane="Simulateur"
/>

<dsfr-container>
  {#if $questionnaireAvecUndo.etapeCourante === 'prealable'}
    <EtapePrealable onsuivant={() => questionnaireAvecUndo.repond(valideEtapePrealable())} />
  {:else if $questionnaireAvecUndo.etapeCourante === 'designationOperateurServicesEssentiels'}
    <EtapeDesignation onsuivant={(reponse) => questionnaireAvecUndo.repond(valideEtapeDesignation([reponse]))} />
  {:else if $questionnaireAvecUndo.etapeCourante === 'appartenanceUnionEuropeenne'}
    <EtapeAppartenanceUE onsuivant={(reponse) => questionnaireAvecUndo.repond(valideEtapeAppartenanceUE([reponse]))} />
  {:else if $questionnaireAvecUndo.etapeCourante === 'typeStructure'}
    <EtapeTypeStructure onsuivant={(reponse) => questionnaireAvecUndo.repond(valideTypeStructure([reponse]))} />
  {:else if $questionnaireAvecUndo.etapeCourante === 'tailleEntitePrivee'}
    <EtapeTailleEntitePrivee
      onsuivant={(reponse) =>
        questionnaireAvecUndo.repond(
          valideTailleEntitePrivee(
            [reponse.nombre],
            [reponse.chiffreAffaire],
            reponse.bilanFinancier ? [reponse.bilanFinancier] : []
          )
        )}
    />
  {:else if $questionnaireAvecUndo.etapeCourante === 'secteursActivite'}
    <EtapeSecteursActivite onsuivant={(reponse) => questionnaireAvecUndo.repond(valideSecteursActivite(reponse))} />
  {:else if $questionnaireAvecUndo.etapeCourante === 'sousSecteursActivite'}
    <EtapeSousSecteursActivite
      secteursChoisis={$questionnaireAvecUndo.secteurActivite.filter((s) => estUnSecteurAvecDesSousSecteurs(s))}
      onsuivant={(reponse) => questionnaireAvecUndo.repond(valideSousSecteursActivite(reponse))}
    />
  {:else if $questionnaireAvecUndo.etapeCourante === 'activites'}
    <EtapeActivites
      secteursChoisis={selectSecteursPourSaisieActivites($questionnaireAvecUndo)}
      onsuivant={(reponse) => questionnaireAvecUndo.repond(valideActivites(reponse))}
    />
  {:else if $questionnaireAvecUndo.etapeCourante === 'localisationEtablissementPrincipal'}
    <EtapeLocalisationEtablissementPrincipal
      onsuivant={(reponse) =>
        questionnaireAvecUndo.repond(
          valideLocalisationEtablissementPrincipal(
            [reponse.paysDecision],
            reponse.paysOperation ? [reponse.paysOperation] : [],
            reponse.paysSalaries ? [reponse.paysSalaries] : []
          )
        )}
    />
  {:else if $questionnaireAvecUndo.etapeCourante === 'localisationFournitureServicesNumeriques'}
    <EtapeLocalisationServicesNumeriques
      onsuivant={(reponse) => questionnaireAvecUndo.repond(valideLocalisationServicesNumeriques(reponse))}
    />
  {:else if $questionnaireAvecUndo.etapeCourante === 'resultat'}
    <EtapeResultat reponses={$questionnaireStore} />
  {/if}
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 20px;
  }
</style>
