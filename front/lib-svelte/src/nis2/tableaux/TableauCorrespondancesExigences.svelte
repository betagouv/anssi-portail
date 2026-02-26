<script lang="ts">
  import { badgesExigence, type ExigenceNis2 } from '../exigence.type';

  export let exigencesNis2: ExigenceNis2[];
</script>

<table>
  <thead>
    <tr>
      <th>Exigence NIS&nbsp;2</th>
      <th>Correspondance</th>
      <th>Référence ISO 27001/27002</th>
      <th>Observations</th>
    </tr>
  </thead>
  <tbody>
    {#each exigencesNis2 as exigence (exigence.reference)}
      <tr>
        <td>
          <dsfr-badges-group badges={badgesExigence(exigence)}
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
        <td>
          {exigence.correspondances.ISO.niveau}
        </td>
        <td>
          <ul>
            {#each exigence.correspondances.ISO.exigences.map((e) => e.contenu) as exigenceCorrespondante (exigenceCorrespondante)}
              <li>{exigenceCorrespondante}</li>
            {/each}
          </ul>
        </td>
        <td>
          {exigence.correspondances.ISO.observations}
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
