<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { type FragmentDeNavigation, creeLeFragmentDeNavigation } from './fragmentDeNavigation.svelte';

  type Props = {
    elements: {
      id: string;
      titre: string;
      ancre?: string;
      icone?: string;
    }[];
    idÉlémentSélectionné?: string;
    fragmentDeNavigation?: FragmentDeNavigation;
    lorsDuClic?: (index: number) => void;
  };
  let {
    elements,
    idÉlémentSélectionné = $bindable(),
    fragmentDeNavigation = creeLeFragmentDeNavigation(),
    lorsDuClic,
  }: Props = $props();

  const hasIcon = $derived(elements.some((e) => !!e.icone));
  const indexÉlémentSélectionné = $derived.by(() => {
    const idx = elements.findIndex((e) => e.id === idÉlémentSélectionné);
    return idx >= 0 ? idx : 0;
  });

  const changeDeSection = (index: number) => {
    idÉlémentSélectionné = elements[index]?.id;
    if (lorsDuClic) {
      lorsDuClic(index);
    }
    const ancre = elements[index].ancre;
    if (ancre) {
      fragmentDeNavigation.changeSection(ancre, true);
    }
  };
</script>

<div class="conteneur">
  <dsfr-segmented
    noLegend
    {hasIcon}
    elements={enPropriétéWebC(
      elements?.map((e, idx) => ({ id: e.id, name: e.id, label: e.titre, icon: e.icone, value: idx }))
    )}
    value={indexÉlémentSélectionné}
    onvaluechanged={(e: CustomEvent<number>) => changeDeSection(e.detail)}
  ></dsfr-segmented>
</div>

<style lang="scss">
  .conteneur {
    padding-block: 16px;
    background: var(--background-default-grey);
    position: sticky;
    top: 0;
    z-index: calc(var(--ground) + 751);

    display: grid;
    place-items: center;
  }
</style>
