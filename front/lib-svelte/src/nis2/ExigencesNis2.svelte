<script lang="ts">
  type ExigenceNis2 = {
    reference: string;
    contenu: string;
  };

  const exigencesNis2: ExigenceNis2[] = [
    {
      reference: '1.1-EI/EE',
      contenu:
        'L’entité liste l’ensemble de ses activités et services, y compris les activités et services qui ne correspondent pas aux critères pour lesquels l’entité est devenue une entité importante ou essentielle (par exemple : une entité essentielle au titre d’une activité exploitation d’un oléoduc liste, en plus des activités et services participant à l’exploitation de l’oléoduc, tous les autres activités et services qu’elle fournit).\n' +
        'Pour chaque entrée de cette liste, l’entité :\n' +
        "•\tidentifie un responsable de l’activité ou du service (par exemple le chef de service auquel est rattachée l'activité ou le service, un directeur métier, la direction générale, etc) ;\n" +
        '•\tliste les systèmes d’information les supportant.',
    },
    {
      reference: '1.2-EI/EE',
      contenu:
        'L’entité précise dans la liste prévue au (a) les systèmes d’information qui ne sont exposés à aucun des risques mentionnés à l’alinéa 2 de l’objectif de sécurité.\n' +
        'L’entité renseigne les justifications de ces choix.',
    },
  ];
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
              badges={[
                { label: 'EI', accent: 'green-archipel' },
                { label: 'EE', accent: 'green-bourgeon' },
              ]}
            ></dsfr-badges-group>
            <dsfr-tags-group
              tags={[
                {
                  label:
                    "Objectif de sécurité 1 : Recensement des systèmes d'information",
                },
                {
                  label: 'Recensement des SI',
                },
                {
                  label: exigence.reference,
                },
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
