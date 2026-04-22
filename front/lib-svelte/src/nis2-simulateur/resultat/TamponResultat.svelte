<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */

  import {
    Regulation,
    type RegulationEntite,
    type ResultatEligibilite,
  } from '../../../../../back/src/metier/nis2-simulateur/Regulation.definitions';
  import { aseptiseHtml } from '../../utils/aseptisationDuHtml';
  import { sousTitre, titres } from './TamponResultat.textes';

  interface Props {
    resultat: ResultatEligibilite;
  }

  let { resultat }: Props = $props();

  const icones: Record<RegulationEntite, string> = {
    Regule: 'check-line',
    NonRegule: 'close-line',
    Incertain: 'question-fill',
  };
</script>

<div
  class="tampon"
  class:eligible={resultat.regulation === Regulation.Regule}
  class:non-eligible={resultat.regulation === Regulation.NonRegule}
  class:incertain-UE={resultat.regulation === Regulation.Incertain}
>
  <lab-anssi-icone nom={icones[resultat.regulation]} taille="lg"></lab-anssi-icone>

  <h4 class="resume">
    {@html aseptiseHtml(titres[resultat.regulation][resultat.typeEntite])}
  </h4>
  <p>{@html aseptiseHtml(sousTitre[resultat.regulation])}</p>
</div>

<style lang="scss">
  .tampon {
    padding: 24px 32px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;

    h4 {
      margin-bottom: 0;
    }
  }

  .eligible {
    background-color: var(--background-contrast-success);

    & h4,
    p,
    lab-anssi-icone {
      color: var(--text-default-success);
    }
  }

  .non-eligible {
    background-color: var(--background-contrast-info);

    & h4,
    p,
    lab-anssi-icone {
      color: var(--text-default-info);
    }
  }

  .incertain-UE {
    background-color: var(--background-contrast-grey);

    & h4,
    p,
    lab-anssi-icone {
      color: var(--text-default-grey);
    }
  }
</style>
