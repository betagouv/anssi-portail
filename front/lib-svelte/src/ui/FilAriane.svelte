<script module lang="ts">
  export type PropsFilAriane = Props;
</script>

<script lang="ts">
  import { DsfrBreadcrumb } from '@lab-anssi/ui-kit';
  import type { Segment } from './filAriane';

  type Props = {
    segments: Segment[];
    fondSombre?: boolean;
  };

  const { segments, fondSombre = false }: Props = $props();
  const id = $props.id();
</script>

<DsfrBreadcrumb
  {id}
  inverse={fondSombre}
  buttonLabel="Voir le fil d'Ariane"
  buttonAriaLabel="Fil d’Ariane"
  segments={segments.map((segment) => ({ ...segment, id: `${id}-${segment.id}` }))}
/>
