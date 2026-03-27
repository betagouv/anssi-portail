<script lang="ts">
  import {
    Regulation,
    type RegulationEntite,
    type ResultatEligibilite,
  } from '../../../../../back/src/metier/nis2-simulateur/Regulation.definitions';
  import { sousTitre, titres } from './TamponResultat.textes';

  /* eslint-disable svelte/no-at-html-tags */
  // Le @html pour le HTML du fichier cousin `.textes`.

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
  <lab-anssi-icone nom={icones[resultat.regulation]} taille="lg"
  ></lab-anssi-icone>

  <h4 class="resume">
    {@html titres[resultat.regulation][resultat.typeEntite]}
  </h4>
  <p>{@html sousTitre[resultat.regulation]}</p>
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
    background-color: #dffdf7ff;

    & h4,
    p,
    lab-anssi-icone {
      color: #37635fff;
    }
  }

  .non-eligible {
    background-color: #fef6e3ff;

    & h4 {
      color: #a88e26;
    }

    & p {
      color: #7d6a20;
    }
  }

  .incertain-UE {
    background-color: #f6f6f6;

    & h4,
    p {
      color: #666;
    }
  }
</style>
