<script lang="ts">
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

  const exigencesNis2: ExigenceNis2[] = [
    {
      reference: '1.1-EI/EE',
      entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
      objectifSecurite:
        "Objectif de sécurité 1: Recensement des systèmes d'information",
      thematique: 'Recensement des SI',
      contenu:
        'L’entité liste l’ensemble de ses activités et services, y compris les activités et services qui ne correspondent pas aux critères pour lesquels l’entité est devenue une entité importante ou essentielle (par exemple : une entité essentielle au titre d’une activité exploitation d’un oléoduc liste, en plus des activités et services participant à l’exploitation de l’oléoduc, tous les autres activités et services qu’elle fournit).\n' +
        'Pour chaque entrée de cette liste, l’entité :\n' +
        "•\tidentifie un responsable de l’activité ou du service (par exemple le chef de service auquel est rattachée l'activité ou le service, un directeur métier, la direction générale, etc) ;\n" +
        '•\tliste les systèmes d’information les supportant.',
    },
    {
      reference: '1.2-EI/EE',
      entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
      objectifSecurite:
        "Objectif de sécurité 1: Recensement des systèmes d'information",
      thematique: 'Recensement des SI',
      contenu:
        'L’entité précise dans la liste prévue au (a) les systèmes d’information qui ne sont exposés à aucun des risques mentionnés à l’alinéa 2 de l’objectif de sécurité.\n' +
        'L’entité renseigne les justifications de ces choix.',
    },
    {
      reference: '2.A.2-EE',
      entitesCible: ['EntiteEssentielle'],
      objectifSecurite:
        "Objectif de sécurité 2: Mise en œuvre d'un cadre de gouvernance de la sécurité numérique",
      thematique: 'Rôles et responsabilités',
      contenu:
        'Il désigne au moins une personne qui le conseille et l’accompagne dans l’exercice de cette responsabilité. Cette personne est le point de contact privilégié de l’Agence nationale de la sécurité des systèmes d’information pour tous les sujets relatifs à la sécurité numérique (incidents de sécurité, communications de l’ANSSI sur les sujets relatifs aux entités essentielles)',
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
