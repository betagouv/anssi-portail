<script lang="ts">
  type Etat = 'ok' | 'ko';
  type TailleImage = '234' | '588' | 'origine';
  type SanteGuide = {
    id: string;
    documents: { nom: string; etat: Etat }[];
    images: Record<TailleImage, Etat>;
  };

  const guidesAvecDocumentsManquants: SanteGuide[] = [
    {
      id: 'Transition-post-quantique-protocole-SSHv2',
      documents: [{ nom: 'transition_post_quantique_ssh_v2.pdf', etat: 'ko' }],
      images: { '234': 'ok', '588': 'ko', origine: 'ok' },
    },
    {
      id: 'cyberattaques-et-remediation-preparer-la-remedation',
      documents: [
        { nom: 'preparation_remediation_fr-web.pdf', etat: 'ko' },
        { nom: 'plan_remediation-modele.xlsx', etat: 'ok' },
        { nom: 'plan_remediation-modele.odt', etat: 'ko' },
      ],
      images: { '234': 'ok', '588': 'ok', origine: 'ok' },
    },
  ];

  const iconeEtat = (etat: Etat) => (etat === 'ok' ? '✅' : '❌');
</script>

<dsfr-container>
  <h2>Santé des guides</h2>

  <h3>Documents/images absents</h3>

  <table>
    <thead>
      <tr>
        <th>Identifiant</th>
        <th>Documents</th>
        <th>Image 234px</th>
        <th>Image 588px</th>
        <th>Image origine</th>
      </tr>
    </thead>
    <tbody>
      {#each guidesAvecDocumentsManquants as guide (guide.id)}
        <tr>
          <td>{guide.id}</td>
          <td>
            {#each guide.documents as document (document.nom)}
              {iconeEtat(document.etat)}
              {document.nom}<br />
            {/each}
          </td>
          <td class="image">{iconeEtat(guide.images['234'])}</td>
          <td class="image">{iconeEtat(guide.images['588'])}</td>
          <td class="image">{iconeEtat(guide.images['origine'])}</td>
        </tr>
      {/each}
    </tbody>
  </table>

</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  table {
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid var(--border-default-grey);
    padding: 8px;

    &.image {
      text-align: center;
    }
  }
</style>
