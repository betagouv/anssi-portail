<script lang="ts">
  import GroupeDeBadges from '../../ui/GroupeDeBadges.svelte';
  import { badgesExigence, type ExigenceCyFun23 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  interface Props {
    exigence: ExigenceCyFun23;
  }

  let { exigence }: Props = $props();
</script>

<GroupeDeBadges badges={badgesExigence(exigence)} />
<dsfr-tag label={exigence.reference} size="sm"></dsfr-tag>
<ContenuExigenceFormate {exigence} />
