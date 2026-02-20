<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

  const labelCategorieEntite = (categorie: CategorieEntite) =>
    ({
      EntiteImportante: 'EI',
      EntiteEssentielle: 'EE',
    })[categorie];

  const couleurCategorieEntite = (categorie: CategorieEntite) =>
    ({
      EntiteImportante: 'green-archipel',
      EntiteEssentielle: 'green-bourgeon',
    })[categorie];

  type ExigenceNis2 = {
    reference: string;
    objectifSecurite: string;
    thematique: string;
    contenu: string;
    entitesCible: CategorieEntite[];
  };

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
  <table>
    <thead>
      <tr>
        <th>Exigence NIS&nbsp;2</th>
      </tr>
    </thead>
    <tbody>
      {#each exigencesNis2 as exigence (exigence.reference)}
        <tr>
          <td>
            <dsfr-badges-group
              badges={exigence.entitesCible.map((categorie) => ({
                label: labelCategorieEntite(categorie),
                accent: couleurCategorieEntite(categorie),
              }))}
            ></dsfr-badges-group>
            <dsfr-tags-group
              tags={[
                { label: exigence.objectifSecurite },
                { label: exigence.thematique },
                { label: exigence.reference },
              ]}
              size="sm"
              groupMarkup="div"
            ></dsfr-tags-group>
            {exigence.contenu}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
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

    table {
      margin-bottom: 1.5rem;

      td,
      th {
        padding: 0.5rem 1rem;
        border: 1px solid black;
      }
    }
  }
</style>
