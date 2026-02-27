<script lang="ts">
  import { type ExigenceISO } from '../exigence.type';

  export let exigence: ExigenceISO;
</script>

<td>
  <dsfr-badges-group badges={{ label: exigence.norme, accent: 'rose' }}
  ></dsfr-badges-group>
  <p class="texte-detail-sm gras">{exigence.chapitre}</p>
  <p class="texte-detail-sm">{exigence.contenu}</p>
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;

    .gras {
      font-weight: bold;
    }

    .texte-detail-sm {
      margin-bottom: 0;
    }

    .texte-detail-sm {
      margin-bottom: 0;
    }
  }
</style>
