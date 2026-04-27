<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import type { ReferentielSelectionne } from '../exigence.type';
  import BoutonReinitialisation from './BoutonReinitialisation.svelte';

  type Props = {
    estBureau: boolean;
    sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2';
    referentielSelectionne: ReferentielSelectionne | undefined;
    langueSelectionnee: 'FR' | 'EN';
    featureFlagNis2CyFun23: boolean;
  };

  let {
    estBureau,
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
    langueSelectionnee = $bindable('FR'),
    featureFlagNis2CyFun23,
  }: Props = $props();

  const inverseComparaison = () => {
    sensComparaison = sensComparaison === 'NIS2_VERS_CIBLE' ? 'SOURCE_VERS_NIS2' : 'NIS2_VERS_CIBLE';
  };

  const optionsReferentiels = $derived([
    { label: 'ISO 2700x', value: 'ISO' },
    { label: 'Annexe au Règlement d’exécution 2024/2690', value: 'AE' },
    ...(featureFlagNis2CyFun23 ? [{ label: 'CyFun 2023', value: 'CyFun23' }] : []),
  ]);

  const optionsLangues = [
    { label: 'FR - Français', value: 'FR' },
    { label: 'EN - English', value: 'EN' },
  ];

  const selectionneLeReferentiel = (referentiel: ReferentielSelectionne) => {
    referentielSelectionne = referentiel;
  };

  const selectionneLaLangue = (langue: 'FR' | 'EN') => {
    if (langue === 'EN') {
      window._paq?.push(['trackEvent', 'NIS2', 'Selection Langue', 'EN']);
    }
    langueSelectionnee = langue;
  };
</script>

<div class="panneau-comparaison" class:bureau={estBureau}>
  <div class="controles">
    <div class="conteneur">
      <div class="comparaison-libelle">
        <p class="texte-standard-md">Comparaison entre référentiels d'exigence</p>
        <p class="texte-mention-xs">
          Comparez les exigences issues du référentiel cyber français (ReCyF) applicables à NIS&nbsp;2 à celles d'autres
          référentiels.
        </p>
      </div>
      <div class="selecteurs" class:inverse={sensComparaison === 'SOURCE_VERS_NIS2'}>
        <dsfr-select
          id="referentielNIS2"
          label=""
          options={[{ label: 'ReCyF (NIS 2)', value: 'NIS2' }]}
          value="NIS2"
          disabled
        ></dsfr-select>
        <dsfr-button
          label=""
          has-icon="true"
          icon-place="only"
          icon={estBureau ? 'arrow-left-right-line' : 'arrow-up-down-line'}
          kind="tertiary"
          use:clic={inverseComparaison}
        ></dsfr-button>
        <dsfr-select
          id="referentielAutre"
          label=""
          value={referentielSelectionne}
          onvaluechanged={(e: CustomEvent) => {
            selectionneLeReferentiel(e.detail);
          }}
          placeholder="Sélectionner"
          placeholderDisabled={false}
          options={optionsReferentiels}
        ></dsfr-select>
      </div>
    </div>
    <dsfr-select
      id="langue"
      label={estBureau ? '' : 'Sélectionner la langue'}
      value={langueSelectionnee}
      onvaluechanged={(e: CustomEvent) => {
        selectionneLaLangue(e.detail);
      }}
      placeholderDisabled={false}
      options={optionsLangues}
    ></dsfr-select>
  </div>

  {#if estBureau}
    <div class="actions">
      <BoutonReinitialisation bind:langueSelectionnee bind:referentielSelectionne bind:sensComparaison />
    </div>
  {/if}
</div>

<style lang="scss">
  .panneau-comparaison {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .selecteurs {
      display: flex;
      flex-direction: column;
      gap: 16px;

      &.inverse {
        flex-direction: column-reverse;
      }
    }

    .controles {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &.bureau {
      display: grid;
      gap: 24px;
      grid-template-rows: repeat(1, fit-content(100%));
      grid-template-columns: repeat(4, minmax(0, 1fr));

      .controles {
        display: grid;
        grid-column: 1 / span 3;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        align-items: end;
      }

      .selecteurs {
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr 40px 1fr;
        align-items: flex-end;

        &.inverse {
          direction: rtl;

          > * {
            direction: ltr;
          }
        }
      }
    }

    .conteneur {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 8px;
      grid-column: 1 / span 2;
      grid-row: 1;

      .comparaison-libelle {
        display: flex;
        flex-direction: column;
        gap: 4px;

        p {
          margin: 0;
        }
      }
    }

    .actions {
      display: flex;
      gap: 1.5rem;
      align-items: self-end;
    }
  }
</style>
