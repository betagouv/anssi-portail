<script lang="ts">
  import type {
    PointsAttentionPrecis,
    ResumesPointsAttention,
  } from '../../../../../back/src/metier/nis2-simulateur/Regulation.definitions';
  import { aseptiseHtml } from '../../utils/aseptisationDuHtml';
  import { Precisions, TextesDesResumes } from './PointsAttention.contenus';

  interface Props {
    resumes: ResumesPointsAttention[];
    precisions: PointsAttentionPrecis[];
  }

  let props: Props = $props();
</script>

<div class="points-attention">
  <dsfr-accordion id="points-attention-details" label="Points d'attention" is-expanded="true">
    {#each props.resumes as resume, i (i)}
      <p>{TextesDesResumes[resume]}</p>
    {/each}

    {#each props.precisions as p, i (i)}
      <h6>{Precisions[p].titre}</h6>
      <!-- eslint-disable svelte/no-at-html-tags -->
      <p>{@html aseptiseHtml(Precisions[p].texte)}</p>
    {/each}
  </dsfr-accordion>
</div>

<style lang="scss">
  .points-attention {
    h6 {
      margin-bottom: 0;
      font-size: 1rem;
    }
    p {
      font-size: 0.875rem;
      margin-top: 0;
    }
    :global a {
      display: inline-flex;
    }
  }
</style>
