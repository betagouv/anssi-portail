<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import type { ReferentielSelectionne } from '../exigence.type';
  import BoutonReinitialisation from './BoutonReinitialisation.svelte';

  type Props = {
    estBureau: boolean;
    sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2';
    referentielSelectionne: ReferentielSelectionne | undefined;
  };

  let {
    estBureau,
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
  }: Props = $props();

  const inverseComparaison = () => {
    sensComparaison =
      sensComparaison === 'NIS2_VERS_CIBLE'
        ? 'SOURCE_VERS_NIS2'
        : 'NIS2_VERS_CIBLE';
  };

  const selectionneLeReferentiel = (referentiel: ReferentielSelectionne) => {
    referentielSelectionne = referentiel;
  };
</script>

<div class="panneau-comparaison" class:bureau={estBureau}>
  <div class="conteneur">
    <div class="comparaison-libelle">
      <p class="texte-standard-md">Comparer les exigences NIS 2</p>
      <p class="texte-mention-xs">
        Comparez les exigences NIS 2 avec des référentiels déjà en place au sein
        de votre organisation.
      </p>
    </div>
    <div
      class="selecteurs"
      class:inverse={sensComparaison === 'SOURCE_VERS_NIS2'}
    >
      <dsfr-select
        id="referentielNIS2"
        label=""
        options={[{ label: 'NIS 2', value: 'NIS2' }]}
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
        options={[
          { label: 'ISO 27001', value: 'ISO' },
          { label: 'AE 2690', value: 'AE' },
        ]}
      ></dsfr-select>
    </div>
  </div>
  {#if estBureau}
    <div class="actions">
      <BoutonReinitialisation
        bind:referentielSelectionne
        bind:sensComparaison
      />
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

    &.bureau {
      display: grid;
      gap: 24px;
      grid-template-rows: repeat(1, fit-content(100%));
      grid-template-columns: repeat(4, minmax(0, 1fr));

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

      .conteneur + .actions {
        align-self: self-end;
        grid-column: 3 / span 2;
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
  }
</style>
