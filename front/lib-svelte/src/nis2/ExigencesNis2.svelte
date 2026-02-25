<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ExigenceNis2 } from './exigence.type';
  import TableauExigencesNIS2Simple from './tableaux/TableauExigencesNIS2Simple.svelte';

  let exigencesNis2: ExigenceNis2[] = [];

  onMount(async () => {
    const axiosResponse = await axios.get<ExigenceNis2[]>(
      '/api/exigences-nis2'
    );
    exigencesNis2 = axiosResponse.data;
  });
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
      <div class="selecteurs">
        <dsfr-select
          id="referentielSource"
          label=""
          options
          placeholder="Sélectionner"
        ></dsfr-select>
        <dsfr-button
          label=""
          has-icon="true"
          icon-place="only"
          icon="arrow-left-right-line"
          kind="tertiary"
        ></dsfr-button>
        <dsfr-select
          id="referentielCible"
          label=""
          options
          placeholder="Sélectionner"
        ></dsfr-select>
      </div>
    </div>
  </div>
  <TableauExigencesNIS2Simple {exigencesNis2} />
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
        }
      }
    }
  }
</style>
