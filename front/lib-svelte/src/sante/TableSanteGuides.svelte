<script lang="ts">
  import type { Etat, SanteGuide } from './Sante.svelte';

  export let guides: SanteGuide[];
  const iconeEtat = (etat: Etat) => (etat === 'ok' ? '✅' : '❌');
</script>

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
    {#each guides as guide (guide.id)}
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

<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid var(--border-default-grey);
    padding: 8px;
  }

  td.image {
    text-align: center;
  }
</style>
