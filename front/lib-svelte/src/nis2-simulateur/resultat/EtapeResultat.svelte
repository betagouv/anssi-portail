<script lang="ts">
  import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
  import * as api from '../simulateurNi2.api';
  import TamponResultat from './TamponResultat.svelte';
  import { evalueEligibilite } from '../../../../../back/src/metier/nis2-simulateur/questionnaire/evalueEligibilite';
  import SpecificationsCompletes from '../../../../../back/src/metier/nis2-simulateur/questionnaire/specifications-completes.csv?raw';
  import PointsAttention from './PointsAttention.svelte';
  import { Regulation } from '../../../../../back/src/metier/nis2-simulateur/Regulation.definitions';
  import LigneEtMaintenant from './LigneEtMaintenant.svelte';
  import { quiScroll } from '../../ui/quiScroll.attachment';

  interface Props {
    reponses: EtatQuestionnaire;
  }

  let props: Props = $props();

  $effect(() => {
    api.envoyerReponses(props.reponses);
  });

  let { resultat } = $derived.by(() => evalueEligibilite(props.reponses, SpecificationsCompletes));
</script>

<div class="resultat" {@attach quiScroll}>
  <TamponResultat {resultat} />

  <PointsAttention resumes={resultat.pointsAttention.resumes} precisions={resultat.pointsAttention.precisions} />

  {#if resultat.regulation === Regulation.Regule}
    <LigneEtMaintenant />

    <div class="cartes">
      <dsfr-card
        title="Accéder à la liste d'exigences applicables à ReCyF (NIS&nbsp;2)"
        description="Découvrez la liste d'exigences applicables à ReCyF (NIS&nbsp;2) pour atteindre les objectifs de sécurité fixés par NIS&nbsp;2 ainsi que l'outil de comparaison de référentiels."
        href="/nis2#exigences"
      ></dsfr-card>
      <dsfr-card
        title="S'abonner à la Newsletter MesServicesCyber"
        description="Restez informé des dernières actualités de la directive NIS&nbsp;2 et autres actualités."
        href="/abonnement-infolettre?adresseRetour=/nis2"
      ></dsfr-card>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille' as *;

  .resultat {
    box-sizing: border-box;
    padding: 40px taille-pour-colonnes(1);
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    gap: 12px;

    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }

    .cartes {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 36px;

      @include a-partir-de(lg) {
        flex-direction: row;
        justify-content: center;
        gap: 24px;
        padding: 0 16px;

        width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);

        dsfr-card {
          width: taille-pour-colonnes(4);
          max-width: 486px;
        }
      }
    }
  }
</style>
