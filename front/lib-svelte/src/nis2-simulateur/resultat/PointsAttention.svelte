<script lang="ts">
  import type {
    PointsAttentionPrecis,
    ResumesPointsAttention,
  } from '../../../../../back/src/metier/nis2-simulateur/Regulation.definitions';
  import Accordeon from '../../ui/Accordeon.svelte';
  import { aseptiseHtml } from '../../utils/aseptisationDuHtml';
  import { Precisions, TextesDesResumes } from './PointsAttention.contenus';

  interface Props {
    resumes: ResumesPointsAttention[];
    precisions: PointsAttentionPrecis[];
  }

  let { resumes, precisions }: Props = $props();
</script>

<div class="points-attention">
  <Accordeon id="points-attention-details" libelle="Points d'attention" estOuvert={true}>
    {#each resumes as resume, i (i)}
      <p>{TextesDesResumes[resume]}</p>
    {/each}

    {#each precisions as p, i (i)}
      <h6>{Precisions[p].titre}</h6>
      <!-- eslint-disable svelte/no-at-html-tags -->
      <p>{@html aseptiseHtml(Precisions[p].texte)}</p>
    {/each}
  </Accordeon>
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
