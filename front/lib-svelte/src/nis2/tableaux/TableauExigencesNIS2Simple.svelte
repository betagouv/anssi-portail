<script lang="ts">
  import type { CategorieEntite, ExigenceNis2 } from '../exigence.type';

  export let exigencesNis2: ExigenceNis2[];

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
</script>

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
              ...(exigence.objectifSecurite
                ? [{ label: exigence.objectifSecurite }]
                : []),
              { label: exigence.thematique },
              { label: exigence.reference },
            ]}
            size="sm"
            groupMarkup="div"
          ></dsfr-tags-group>
          <p class="texte-detail-sm">{exigence.contenu}</p>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    margin-bottom: 1.5rem;
    border-collapse: collapse;

    td,
    th {
      padding: 0.5rem 1rem;
      border: 1px solid black;
    }

    td .texte-detail-sm {
      margin-bottom: 0;
    }
  }
</style>
