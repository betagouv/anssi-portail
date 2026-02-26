<script lang="ts">
  import { badgesExigence, type ExigenceNis2 } from '../exigence.type';

  export let exigence: ExigenceNis2;
</script>

<dsfr-badges-group badges={badgesExigence(exigence)}></dsfr-badges-group>
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
{#each exigence.contenu.split('\n') as paragraphe (paragraphe)}
  <p class="texte-detail-sm">{paragraphe}</p>
{/each}

<style lang="scss">
  .texte-detail-sm {
    margin-bottom: 0;

    + .texte-detail-sm {
      margin-top: 24px;
    }
  }
</style>
