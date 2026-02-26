<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ExigenceNis2 } from './exigence.type';
  import TableauExigencesNIS2Simple from './tableaux/TableauExigencesNIS2Simple.svelte';
  import { clic } from '../directives/actions.svelte';

  type Referentiel = 'NIS2' | 'ISO' | '';
  type ReferentielSelectionne = Exclude<Referentiel, 'NIS2'>;

  let exigencesNis2: ExigenceNis2[] = [];

  onMount(async () => {
    const axiosResponse = await axios.get<ExigenceNis2[]>(
      '/api/exigences-nis2'
    );
    exigencesNis2 = axiosResponse.data;
  });

  let sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2' =
    'NIS2_VERS_CIBLE';
  $: mode = referentielSelectionne ? 'COMPARAISON' : 'LISTE';

  let referentielSelectionne: ReferentielSelectionne = '';

  const inverseComparaison = () => {
    sensComparaison =
      sensComparaison === 'NIS2_VERS_CIBLE'
        ? 'SOURCE_VERS_NIS2'
        : 'NIS2_VERS_CIBLE';
  };

  const selectionneLeReferentiel = (referentiel: ReferentielSelectionne) => {
    referentielSelectionne = referentiel;
  };

  const reinitialise = () => {
    referentielSelectionne = '';
    sensComparaison = 'NIS2_VERS_CIBLE';
  };
</script>

<dsfr-container>
  <dsfr-alert type="info" size="md">
    <p slot="description">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce blandit
      blandit mattis. Duis convallis orci dolor, in vulputate neque ultricies
      cursus. Vestibulum tempus quam quis scelerisque viverra. Vestibulum at
      luctus tortor, eu eleifend justo. Vivamus posuere diam ac ultricies
      gravida.
      <dsfr-link label="En savoir plus sur le référentiel ReCyF" href="#" blank
      ></dsfr-link>
    </p>
  </dsfr-alert>
  <h2>Liste des exigences NIS 2</h2>
  <div class="panneau-comparaison">
    <div class="conteneur">
      <div class="comparaison-libelle">
        <p class="texte-standard-md">Comparer les exigences NIS 2</p>
        <p class="texte-mention-xs">
          Comparez les exigences NIS 2 avec des référentiels déjà en place au
          sein de votre organisation.
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
          icon="arrow-left-right-line"
          kind="tertiary"
          use:clic={inverseComparaison}
        ></dsfr-button>
        <dsfr-select
          id="referentielAutre"
          label=""
          value={referentielSelectionne}
          onvaluechanged={(e: CustomEvent) =>
            selectionneLeReferentiel(e.detail)}
          placeholder="Sélectionner une option"
          placeholderDisabled={false}
          options={[{ label: 'ISO 27001', value: 'ISO' }]}
        ></dsfr-select>
      </div>
    </div>
    {#if mode === 'COMPARAISON'}
      <dsfr-button
        label="Réinitialiser"
        has-icon="true"
        icon-place="left"
        icon="close-circle-line"
        kind="tertiary"
        use:clic={reinitialise}
      ></dsfr-button>
    {/if}
  </div>
  {#if mode === 'LISTE'}
    <TableauExigencesNIS2Simple {exigencesNis2} />
  {:else}
    <p>À venir...</p>
  {/if}
  <dsfr-link
    label="Haut de page"
    href="#"
    size="md"
    has-icon
    icon="arrow-up-fill"
  ></dsfr-link>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 4.5rem;

    dsfr-alert {
      margin-bottom: 1.5rem;
    }

    .panneau-comparaison {
      display: grid;
      gap: 24px;
      grid-template-rows: repeat(1, fit-content(100%));
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin: 0 0 24px;
      padding: 0 0 16px;

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

      .conteneur + dsfr-button {
        align-items: self-end;
        grid-column: 3 / span 2;
      }
    }
  }
</style>
